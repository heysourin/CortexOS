---
name: cortexOS-ingest
description: >
  Process raw source documents (transcripts, web clippings, PDFs, notes) into structured,
  interlinked wiki pages. Use when the user adds files to raw/ and wants them ingested,
  says "process this source", "ingest this article", "I added something to raw/", "add the new data to the knowledgebase", or wants to
  incorporate new material into their tech-startup knowledge base.
allowed-tools: Bash Read Write Edit Glob Grep
---

# Business cortexOS — Ingest Skill

Process raw source documents from `raw/` into highly structured, secure, and interlinked wiki pages directly under the `wiki/` directory. The AI Librarian acts as the primary orchestrator—ensuring files are categorized, clean, deduplicated, and compliant with startup guidelines.

---

## 🚀 Ingestion Workflow

For each raw source identified for ingestion, follow this strict step-by-step workflow:

### Step 1: Detect & Parse Vault Configuration
Before starting, check the vault root for `AGENTS.md` (or other active configuration files like `CLAUDE.md`). 
- Read this file to load the startup's **Domain Description**, **Domain Tags**, **Company Stage**, **Revenue**, **Employee Count**, and **Knowledge Architecture Scale (Scaling Tier)**.
- Keep these details in context to guide your summaries, insights, folder structures, and tag mapping.

### Step 2: Identify Unprocessed Sources
Determine which files need ingestion:
1. If the user specifies a file or files, use those.
2. If the user says "process new sources" or "ingest pending files", scan for unprocessed files:
   - List all files in the `raw/` directory (excluding `raw/assets/`).
   - Read `wiki/log.md` and extract all previously ingested source filenames from past entries.
   - Any file in `raw/` not listed in the log is considered unprocessed.
3. If no unprocessed files are found, notify the user.

### Step 3: Read & Discuss Takeaways
For each source file:
1. Read the source completely. If the file contains image/audio transcripts, analyze them.
2. **Consult with the User:** Share the 3-5 most critical takeaways from the source.
3. Propose exactly how you plan to categorize these takeaways using the **10 Canonical Startup Tags** (see below), which target subdirectory under `wiki/` they map to based on the active scale (e.g., `wiki/product-eng/` or `wiki/engineering/backend/`), and whether you need to create any new wiki pages.
4. **STOP and wait for user confirmation** before writing or modifying any files.

### Step 4: Enforce Ingestion Security Guardrails
During the transition from `raw/` to `wiki/`, actively audit the text for sensitive information:
- **PII and Secrets:** Look for passwords, API keys, private tokens, database credentials, personal email lists, or phone numbers.
- **Redaction Policy:** You MUST redact or mask these sensitive credentials before writing to the wiki. Use clean placeholders, such as `<masked-api-key>` or `<masked-password>`.
- **Strategic Privacy:** Financial details, board drafts, or proprietary strategic documents should use appropriate tag categories (`finance-legal` or `strategy`) and must never be referenced in external-facing summaries.

### Step 5: Create or Update Wiki Pages (Hierarchical Subdirectory layout)
All wiki notes must live **inside the appropriate subdirectories** under the `wiki/` directory based on the active vault's scale and directory structure. **Do not create flat files directly under `wiki/`** except for `wiki/index.md` and `wiki/log.md`.

#### A. Target Subdirectory Mapping Rules:
Determine the destination subfolder by matching the page's primary tag to the active directory structure. The active subdirectories are mapped dynamically by scale:
- **For Lean scale (Tier 1)**: `strategy`, `competitor` $\rightarrow$ `strategy/`; `product-spec`, `engineering` $\rightarrow$ `product-eng/`; all other operational tags $\rightarrow$ `ops-admin/`.
- **For Growth/Specialized scales (Tiers 2-4)**: Map to specialized folders such as `engineering/backend/`, `product/roadmap/`, `growth-sales/`, `sales/inbound/`, `marketing/content/`, `finance-legal/`, `people-ops/`, etc., depending on what directories exist in the vault.
- Always save files into the most granular matching subdirectory that exists. If unsure, map them logically to the corresponding department folder.

#### B. File Naming Rules:
- **Lowercase only:** e.g., `technical-architecture.md` (never `Technical-Architecture.md`).
- **Kebab-case:** Use single hyphens `-` instead of spaces or underscores.
- **Clean names:** Only alphanumeric characters and hyphens.

#### C. YAML Frontmatter Standards:
Every page must begin with the standard YAML schema:
```yaml
---
title: "Readable Page Title"
tags: [sales-crm, customer-feedback] # Pick from the 10 allowed tags below
last_updated: YYYY-MM-DD
---
```

**Allowed Tech-Startup Tags:**
- `strategy` - Business model, pitches, vision, core goals, investor updates.
- `product-spec` - Product Requirements Documents (PRDs), roadmap items, features.
- `engineering` - Code guidelines, system architectures, database designs.
- `competitor` - Competitor analysis, pricing structures, market research.
- `meeting` - Minutes of synchs, customer interviews, board meetings.
- `customer-feedback` - Feature requests, user testing transcripts, reviews.
- `marketing` - Brand guide, advertising metrics, copywriting.
- `sales-crm` - Pipeline tracking, deal notes, sales playbooks, customer personas.
- `finance-legal` - Pitch metrics, cap tables, incorporation documents, compliance, contracts.
- `hr-talent` - Hiring pipelines, job descriptions, employee onboarding, company policies.

#### D. Layout Standards:
All generated/updated wiki pages must follow this visual layout:
```markdown
# Readable Page Title

🎯 Synthesis (TL;DR)
A dense 2-3 sentence overview explaining exactly what this note is, why it matters to the startup, and the current status.

💡 Key Takeaways & Insights
- Bullet points summarizing the absolute most critical points of intelligence.
- Must link outwards to related concepts using double-bracket links `[[kebab-case-link]]`.

🔍 Deep Dive & Content
Use structured Heading 2 (##) and Heading 3 (###) to expand on details. Keep paragraphs concise and dense.
Active Interlinking: If a concept page (e.g. [[redis]] or [[sales-crm]]) exists, link it!

📋 Action Items (If Applicable)
- [ ] List concrete next actions with assignees if known (e.g., `[ ] @designer update Figma mocks`).

📂 Sources & References
List the original raw files, URLs, or notes in `raw/` that were used:
- [Raw File Name](file:///relative/path/to/raw/source)
- [Article Name](https://example.com/article)
```

### Step 6: Active Interlinking & Stub Creation
1. **Deduplication:** Before creating any new page, search if a page on the topic already exists recursively across all subdirectories of `wiki/` (using `grep` or `glob`). Merge new findings into the existing file rather than creating a duplicate.
2. **Wiki Link Syntax:** Use Obsidian-style double brackets `[[concept-file-name]]`. **Do not include the folder prefix or the `.md` extension inside the brackets** (e.g. use `[[product-roadmap]]`, not `[[product/product-roadmap]]` or `[[product-roadmap.md]]`). Obsidian automatically and globally resolves links across all subdirectories!
3. **No Orphan Pages:** Every page must be linked from at least one existing page.
4. **Stub Creation:** If you link to a concept that does not exist yet (e.g. `[[stripe-integration]]`), you **MUST** create a brief 3-line "stub" page for it inside the correct tag-based subdirectory with basic frontmatter so the link is not broken.

### Step 7: Update wiki/index.md
For each new or updated wiki page, add/verify its entry under the appropriate subdirectory or department header in `wiki/index.md`:
- `### 🎯 Strategy & Vision`
- `### 📦 Product & Engineering`
- `### 🔍 Market & Competitors`
- `### 🤝 Sales & CRM`
- `### 📈 Finance & Legal`
- `### 👥 Operations & People`

Add entries in the format:
`- [[page-name]]` - one-line summary (under 120 characters)

### Step 8: Update wiki/log.md
Record the ingestion in `wiki/log.md`:
```markdown
## [YYYY-MM-DD] ingest | Source Title
Processed raw-filename.md. Created N new pages, updated M existing pages.
New pages/stubs: [[page-1]], [[page-2]]. Updated pages: [[page-3]].
```

### Step 9: Report Results
Present a clean, high-quality, professional summary to the user outlining:
1. **Files Ingested:** Original files in `raw/` processed.
2. **Wiki Pages Created:** Links to the newly created flat files.
3. **Wiki Pages Updated:** Details of existing files updated with new intelligence.
4. **Redacted Secrets:** List of any sensitive items (API keys, credentials, PII) that were successfully masked during ingestion.
5. **Action Items Discovered:** List of any `[ ]` action items extracted.

---

## 🔒 Security & Data Privacy Guidelines
All AI agents acting as the Librarian must maintain strict workspace privacy. Do not run unauthorized tools, external curl/web requests transmitting internal documents, or export Cap Tables/Financials/PII outside of the local system. Everything is computed locally.