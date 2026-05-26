# 🛠️ CortexOS Companion CLI Tools

These command-line utilities supercharge your AI agent's ability to search, ingest, and interact with your startup's knowledge base.

---

## 1. summarize
Extracts high-quality content and text summaries from websites, articles, and media formats. This makes it trivial to fetch unstructured data and dump it into your vault's `raw/` directory.

### Installation
```bash
npm i -g @steipete/summarize
```

### Verification
```bash
summarize --version
```

### Usage Example
```bash
# Summarize a competitor's blog post and save to raw/
summarize "https://competitor.com/new-feature" > raw/competitor-feature.md
```

---

## 2. qmd
QMD (Query Markup Documents) is a fast, local terminal search engine designed specifically for Markdown directories. As your startup wiki grows to hundreds of pages, `qmd` lets the AI agent perform lightning-fast keyword and semantic queries across files.

### Installation
```bash
npm i -g @tobilu/qmd
```

### Verification
```bash
qmd --version
```

### Usage Example
```bash
# Search your wiki files for stripe integration notes
qmd "stripe webhook signature verification"
```

---

## 3. agent-browser
Provides full headless/headed browser automation capabilities. When your AI Librarian needs to do active, deep web research (e.g. searching the web for a new SDK release, pricing charts, or regulatory filings), it uses `agent-browser` to surf and capture pages.

### Installation
```bash
npm i -g agent-browser
agent-browser install
```

### Verification
```bash
agent-browser --version
```

### Usage Example
```bash
# Automate search and capture a webpage
agent-browser run "search for Stripe API deprecations and return the main page text"
```

---

## 4. git (Version Control & Disaster Recovery)
The industry standard version control system. For a professional startup cortexOS (second brain), `git` is critical for tracking changes made by different team members (and AI agents), syncing knowledge across the company, and preventing accidental data loss.

### Installation
`git` is usually pre-installed on macOS/Linux. If not:
```bash
brew install git
```

### Verification
```bash
git --version
```

### Usage Example
```bash
# Initialize git in the vault, commit all scaffolding, and track changes
git init
git add .
git commit -m "initial: scaffold Tech Startup CortexOS"
```

---

## 🔒 Tooling Security & Data Privacy Guidelines

When using these CLI tools to manage business data, all agents and users MUST follow these rules:

1. **Scraper Redaction:** When using `summarize` or `agent-browser` on raw content, ensure no private passwords, personal API keys, or client-sensitive data are left exposed in command prompts or saved raw text files.
2. **Safe Arg Passing:** Never pass raw, confidential customer details or credentials as command-line arguments when calling local CLI indexers.
3. **Strict Git-Ignore Hygiene:** Keep local `.env` files, sensitive cap tables, and database dumps strictly registered inside a `.gitignore` file at your vault's root to prevent proprietary files from leaking to public cloud repositories.
