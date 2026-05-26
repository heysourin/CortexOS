---
name: cortexOS

description: >
  Set up a new Obsidian knowledge base with the LLM Wiki pattern tailored specifically for a stage-independent tech startup. Use when the user wants to create a startup cortexOS (ie a second brain), initialize a vault, set up a corporate/team wiki, or says "onboard". Guides through an interactive wizard to configure vault name, location, startup domain and web-discovery, agent support, and tooling.

allowed-tools: Bash Read Write Glob Grep
---

# Tech Startup CortexOS — Onboarding Wizard

Set up a new Obsidian knowledge base using the LLM Wiki pattern tailored for tech startups. The LLM acts as librarian — reading raw sources (web clippings, transcripts, papers), compiling them into a structured interlinked startup wiki (covering Strategy, Product/Eng, Competitors, Sales/CRM, Finance/Legal, HR), and maintaining it over time.

## Wizard Flow

Guide the user through these 5 steps. Ask ONE question at a time. Each step has a sensible default — the user can accept it or provide their own value.

### Step 1: Vault Name

Ask:
> "What would you like to name your company's CortexOS? This will be the folder name."
> Default: `cortexOS-for-business`

Accept any user-provided name. This becomes the folder name and the title in the agent config.

### Step 2: Vault Location

Ask:
> "Where should I create it? Give me a path, or I'll use the default."
> Default: `~/Documents/`

Accept any absolute or relative path. Resolve `~` to the user's home directory. The final vault path is `{location}/{vault-name}/`.

### Step 3: Startup Domain & Web Discovery

Ask:
> "What is your startup's website URL? (e.g. `https://mycompany.com`). If you don't have one yet, or want to configure manually, just press Enter or type 'skip'."

If a website URL is provided:
1. **Web Scrape Discovery:** Use `read_url_content` or similar tools to fetch and read the landing page text of the provided URL.
2. **Auto-Detect & Analyze:** Based on the website text, automatically formulate:
   - A concise, premium one-sentence **domain description** of the startup's product and mission.
   - A list of **5-8 domain-specific tags** mapped to the startup's category and tech stack (e.g. `b2b-saas`, `generative-ai`, `fintech`, `kubernetes`, `devops`).
3. **Present and Confirm:** Present these discovered values to the user for validation:
   > "I've scanned your website and auto-detected the following details for your CortexOS:"
   > - **Description:** [domain description]
   > - **Suggested Tags:** [tags]
   > 
   > "Does this look good, or would you like to modify anything?"
4. Accept modifications or approval.

If skipped, empty, or fetching fails:
1. Ask the user:
   > "What does your startup do? Give me a brief, one-sentence description."
2. Ask the user for 5-8 relevant industry tags (e.g., `ai-agents`, `cybersecurity`, `e-commerce`), offering 3-4 suggestions based on their description.

### Step 4: Agent Config

Auto-detect which agent is running this skill. State it clearly:
> "I'm running in **[Agent Name]**, so I'll generate a **[config file]** for this vault."

Then ask:
> "Do you use any other AI agents you'd like config files for? Options: Claude Code, Antigravity IDE / Codex, Cursor, Gemini CLI — or skip."

Skip the agent that was auto-detected. Generate configs for all selected agents.

**Agent detection logic:**
- If the environment or active IDE is Google Antigravity IDE → Antigravity IDE / Codex
- If the `CLAUDE.md` convention is being used or the Skill tool is Claude Code's → Claude Code
- If the environment indicates Codex → Antigravity IDE / Codex
- If `.cursor/` exists in the working directory → Cursor
- If `GEMINI.md` convention is being used → Gemini CLI
- If unsure, ask the user which agent they're using

### Step 5: Optional CLI Tools

Ask:
> "These tools extend what the LLM can do with your vault. All optional but recommended:"
>
> 1. **summarize** — summarize links, files, and media from the CLI
> 2. **qmd** — local search engine for your wiki (helpful as it grows)
> 3. **agent-browser** — browser automation for web research
>
> "Install all, pick specific ones (e.g. '1 and 3'), or skip?"

## Post-Wizard: Scaffold the Vault

After collecting all answers, execute these steps in order:

### 1. Create directory structure

Run the onboarding script, passing the full vault path:

```
bash <skill-directory>/scripts/onboarding.sh <vault-path>
```

This creates all directories and the initial `wiki/index.md` and `wiki/log.md` files.

### 2. Generate agent config file(s)

For each selected agent, read the corresponding template from `<skill-directory>/references/agent-configs/`:

| Agent | Template | Output File | Output Location |
|---|---|---|---|
| Claude Code | `claude-code.md` | `CLAUDE.md` | Vault root |
| Antigravity IDE / Codex | `codex.md` | `AGENTS.md` | Vault root |
| Cursor | `cursor.md` | `cortexOS-for-business.mdc` | `<vault>/.cursor/rules/` |
| Gemini CLI | `gemini.md` | `GEMINI.md` | Vault root |

For each template, replace the placeholders:

- `{{VAULT_NAME}}` → the vault name from Step 1
- `{{DOMAIN_DESCRIPTION}}` → a one-line description derived from Step 3
- `{{DOMAIN_TAGS}}` → generate 5-8 domain-relevant tags as a bullet list based on the domain from Step 3
- `{{WIKI_SCHEMA}}` → read `<skill-directory>/references/wiki-schema.md` and insert everything from `## Architecture` onward

Write the generated config to the vault.

### 3. Update wiki/log.md

Append the setup entry:

```
## [YYYY-MM-DD] setup | Vault initialized
Created vault "{{VAULT_NAME}}" for {{DOMAIN_DESCRIPTION}}.
Agent configs: {{list of generated config files}}.
```

### 4. Install CLI tools (if selected)

For each tool the user selected in Step 5, run the install command:

- summarize: `npm i -g @steipete/summarize`
- qmd: `npm i -g @tobilu/qmd`
- agent-browser: `npm i -g agent-browser && agent-browser install`

After each install, verify with `<tool> --version`. Report success or failure for each.

### 5. Print summary

Show the user:

1. **What was created** — directory tree and config files
2. **Next steps for installation:**
   - **Install Obsidian:** Download and install the official Obsidian app: https://obsidian.md/
   - **Install Obsidian Web Clipper:** Install the official browser extension to easily clip web articles directly into your vault:
     https://chromewebstore.google.com/detail/obsidian-web-clipper/cnjifjpddelmedmihgijeibhnjfabmlf
3. **How to start** — open the vault folder in Obsidian, clip an article or add a raw file to `raw/`, then run your agent's ingest command.

## Reference Files

These files are bundled with this skill and available at `<skill-directory>/references/`:

- `wiki-schema.md` — canonical wiki rules (single source of truth for all agent configs)
- `tooling.md` — CLI tool details, install commands, and verification steps
- `agent-configs/claude-code.md` — CLAUDE.md template
- `agent-configs/codex.md` — AGENTS.md template
- `agent-configs/cursor.md` — Cursor rules template
- `agent-configs/gemini.md` — GEMINI.md template

## Next Steps

After setup is complete, the user's workflow is:

1. **Clip articles** to `raw/` using the Obsidian Web Clipper
2. **Ingest sources** with `/cortexOS-ingest` — processes raw files into wiki pages
3. **Ask questions** with `/cortexOS-query` — searches and synthesizes from the wiki
4. **Health-check** with `/cortexOS-lint` — run after every 10 ingests or monthly