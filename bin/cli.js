#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// ANSI color helpers
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m'
};

function log(msg) {
  console.log(`${colors.cyan}[skills-cli]${colors.reset} ${msg}`);
}

function success(msg) {
  console.log(`${colors.green}[skills-cli] Success: ${msg}${colors.reset}`);
}

function warn(msg) {
  console.warn(`${colors.yellow}[skills-cli] Warning: ${msg}${colors.reset}`);
}

function errorExit(msg) {
  console.error(`${colors.red}[skills-cli] Error: ${msg}${colors.reset}`);
  process.exit(1);
}

// 1. Parse Arguments
// Example: npx skills add https://github.com/heysourin/CortexOS --skill '*'
const args = process.argv.slice(2);
const command = args[0];

if (!command || command !== 'add') {
  errorExit("Invalid command. Usage: npx skills add <repository-url> --skill <skill-name>");
}

let repoUrl = args[1];
if (!repoUrl) {
  errorExit("Please provide a repository URL or GitHub shorthand. Example: npx skills add NicholasSpisak/second-brain");
}

// Convert shorthand GitHub notation (e.g. NicholasSpisak/second-brain) to a full URL
if (!repoUrl.startsWith('http://') && !repoUrl.startsWith('https://') && !repoUrl.includes('@')) {
  if (repoUrl.includes('/')) {
    repoUrl = `https://github.com/${repoUrl}.git`;
  } else {
    errorExit(`Invalid repository format "${repoUrl}". Please provide a full URL or 'owner/repo' shorthand.`);
  }
}

let skillName = '*';
const skillIndex = args.indexOf('--skill');
if (skillIndex !== -1 && args[skillIndex + 1]) {
  skillName = args[skillIndex + 1];
}

// 2. Resolve target directories
const homeDir = os.homedir();
const projectDir = process.env.INIT_CWD || process.cwd();

const targetDirs = [
  path.join(homeDir, '.agents', 'skills'),
  path.join(homeDir, '.claude', 'skills'),
  path.join(projectDir, '.agents', 'skills'),
  path.join(projectDir, '.claude', 'skills')
];

// Ensure unique target paths
const uniqueTargets = Array.from(new Set(targetDirs));

// 3. Setup Temp Directory for Cloning
const tempDirName = `skills-temp-${Date.now()}`;
const tempDir = path.join(os.tmpdir(), tempDirName);

log(`Cloning repository ${repoUrl} to a temporary location...`);

try {
  // Shallow clone with --depth 1 for maximum speed
  execSync(`git clone --depth 1 ${repoUrl} "${tempDir}"`, { stdio: 'ignore' });
} catch (err) {
  errorExit(`Failed to clone git repository. Ensure Git is installed and the repository URL is public. Details: ${err.message}`);
}

// Helper to recursively find files in a directory
function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    // Ignore .git directory
    if (file === '.git') continue;
    
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Helper to check if a markdown file is an agent skill (by parsing frontmatter)
function isSkillFile(filePath, specificName = '*') {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check if it starts with YAML frontmatter
    if (!content.startsWith('---')) return false;
    
    const endFrontmatterIndex = content.indexOf('---', 3);
    if (endFrontmatterIndex === -1) return false;
    
    const frontmatter = content.substring(3, endFrontmatterIndex);
    
    // Parse key-value pairs from frontmatter
    const nameMatch = frontmatter.match(/name:\s*['"]?([a-zA-Z0-9-_*]+)['"]?/);
    if (!nameMatch) return false;
    
    const parsedName = nameMatch[1].trim();
    
    if (specificName === '*') {
      return { isValid: true, skillName: parsedName };
    }
    
    if (parsedName.toLowerCase() === specificName.toLowerCase()) {
      return { isValid: true, skillName: parsedName };
    }
    
    // Fallback: match filename if frontmatter name doesn't match but matches specificName
    const baseName = path.basename(filePath, '.md');
    if (baseName.toLowerCase() === specificName.toLowerCase()) {
      return { isValid: true, skillName: baseName };
    }
  } catch (e) {
    // Ignore read errors
  }
  return false;
}

try {
  log("Scanning repository for skills...");
  const allFiles = getFilesRecursively(tempDir);
  const foundSkills = [];

  for (const file of allFiles) {
    if (file.endsWith('.md')) {
      const match = isSkillFile(file, skillName);
      if (match) {
        foundSkills.push({
          sourcePath: file,
          skillName: match.skillName
        });
      }
    }
  }

  if (foundSkills.length === 0) {
    if (skillName === '*') {
      warn("No skills found in the repository. Make sure your skill files start with a YAML frontmatter containing 'name' and 'description'.");
    } else {
      warn(`No skill matching "${skillName}" was found in the repository.`);
    }
  } else {
    log(`Found ${foundSkills.length} skill(s) to install.`);
    
    // Copy the found skills to all unique targets
    uniqueTargets.forEach((targetDir) => {
      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
          log(`Created directory: ${targetDir}`);
        }

        foundSkills.forEach((skill) => {
          const destinationFile = path.join(targetDir, `${skill.skillName}.md`);
          fs.copyFileSync(skill.sourcePath, destinationFile);
          log(`Installed ${skill.skillName} -> ${destinationFile}`);
        });
      } catch (err) {
        warn(`Could not install to directory ${targetDir}: ${err.message}`);
      }
    });

    success(`Successfully installed ${foundSkills.map(s => s.skillName).join(', ')}!`);
  }
} catch (err) {
  warn(`An error occurred during skill installation: ${err.message}`);
} finally {
  // 4. Clean Up Temp Directory
  try {
    if (fs.existsSync(tempDir)) {
      // Recursive delete
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } catch (err) {
    // Ignore cleanup error
  }
}
