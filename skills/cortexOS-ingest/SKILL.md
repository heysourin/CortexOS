---
name: cortexOS-ingest
description: >
  Process raw source documents (transcripts, web clippings, PDFs, notes) into structured,
  interlinked wiki pages under scale-based directories. Use when the user adds files to raw/
  and wants them ingested, says "process this source", "ingest this article", "I added something to raw/",
  or wants to incorporate new material into their second brain knowledge base.
allowed-tools: Bash Read Write Edit Glob Grep
---

# Tech Startup cortexOS — Ingest

Process raw source documents from `raw/` into structured, interlinked wiki pages inside scale-based subdirectories. The AI Librarian acts as the primary orchestrator—ensuring files are atomic, clean, deduplicated, and deeply connected.

---

## Identify Sources to Process

Determine which files need ingestion:

1. If the user specifies a file or files, use those.
2. If the user says "process new sources" or similar, detect unprocessed files:
   - List all files in the `raw/` directory (excluding `raw/assets/`).
   - Read `wiki/log.md` and extract all previously ingested source filenames from `ingest` entries.
   - Any file in `raw/` not listed in the log is unprocessed.
3. If no unprocessed files are found, notify the user.

---

## Ingest Process (8-Step Workflow)

For each raw source identified for ingestion, follow this strict step-by-step workflow:

### Step 1: Detect & Parse Vault Configuration
Before starting, check the vault root for `AGENTS.md` (or other active configuration files like `CLAUDE.md`).
- Read this file to load the startup's **Domain Description**, **Domain Tags**, **Company Stage**, **Revenue**, **Employee Count**, and **Knowledge Architecture Scale (Scaling Tier)**.
- Identify the active subdirectory structure created inside your `wiki/` directory.

### Step 2: Read the Source Completely
Read the entire source file. If the file contains image or audio transcripts, analyze them. If an image contains important diagrams, charts, or data, note its description so the knowledge is captured.

### Step 3: Discuss Key Takeaways with the User
Before writing any files, share the 3–5 most critical takeaways from the source. 
**Knowledge Graph Atomization (The Secret to Graph Density):**
Identify all **Entities** (people, competitor companies, partners, products, tools, e.g. `loreal`, `curology`) and **Concepts** (industry trends, tech frameworks, features, standard terms, e.g. `ai-skin-analysis`, `skinimalism`) mentioned in the raw source.
- Propose a structured list of individual, highly focused **atomic pages** you plan to create or update.
- Ask the user if they want to emphasize any particular aspects or skip any topics. **STOP and wait for user confirmation** before proceeding.

### Step 4: Enforce Ingestion Security Guardrails
During the transition from `raw/` to `wiki/`, actively audit the text for sensitive information:
- **PII and Secrets:** Redact or mask passwords, API keys, private tokens, database credentials, personal email lists, or phone numbers using clean placeholders (e.g., `<masked-api-key>`).
- **Strategic Privacy:** Keep financials, board drafts, or proprietary strategic details in appropriate protected tag categories (`finance-legal` or `strategy`).

### Step 5: Create or Update Wiki Pages (Hierarchical Subdirectory layout)
All wiki notes must live **inside the appropriate subdirectories** under the `wiki/` directory based on the active vault's scale and directory structure. **Do not compile files into a few broad department summaries.** Instead, split and atomize the knowledge into these page types.

> [!IMPORTANT]
> **EXHAUSTIVE EXTRACTION & THE TOKEN LIMIT BOTTLENECK:**
> A large source document (e.g. 50 pages) must yield **40+ atomic, deeply interlinked pages**. Pruning, omitting, or grouping separate entities/concepts into a single broad department summary is a critical failure.
> To prevent hitting your physical **output token limit (typically 4,096 tokens)** during massive multi-file creation, you MUST keep Entity and Concept pages **extremely brief, atomic, and focused (under 100-150 tokens per file)**:
> - **Source Summary Pages**: Placed in `wiki/sources/`. These are the master records and should use the full detailed layout standard (Synthesis, Key Takeaways, Deep Dive, Action Items).
> - **Entity & Concept Pages**: Placed in the corresponding department directories. These must use the atomic layout (YAML frontmatter + H1 + 1-2 dense paragraphs detailing the entity/concept + double-bracket wikilinks in text + sources). Keep them extremely concise!
> 
> **Incremental Ingestion Protocol (Handling Large Sources):**
> If the raw source is large or yields more than 5–8 new or updated atomic pages, you **MUST NOT** attempt to create/update all files in a single LLM response. Doing so will truncate your output and leave the vault corrupted. Instead, proceed incrementally:
> 1. In your **first turn**, create only the master **Source Summary Page** in `wiki/sources/<raw-filename>.md` and output your proposed list of atomic Entity/Concept pages.
> 2. Present this plan clearly to the user, and **STOP** to ask for confirmation to proceed.
> 3. Once approved, create or update the atomic pages in **batches of 5–8 files per turn**.
> 4. In each turn, list the files successfully written, then ask: *"Should I proceed with the next batch of 5–8 files?"*
> 5. Continue this batching pattern until the entire planned list of pages is successfully ingested.

1. **Source Summary Pages**: For every ingested raw source, create or update a dedicated summary file inside the `sources/` subdirectory (or equivalent research/notes subdirectory). Name it `wiki/sources/<raw-filename>.md`.
2. **Entity Pages**: Create/update dedicated pages for each organization, tool, person, or competitor. File them under the active subdirectory matching their primary department (e.g. `wiki/growth/` for competitors, `wiki/engineering/` for technical tools).
3. **Concept Pages**: Create/update dedicated pages for ideas, frameworks, features, or patterns. File them under the active subdirectory matching their category (e.g. `wiki/research/` for market trends, `wiki/product/` for product features).

**Target Subdirectory Mapping Rules:**
- Always save files into the most granular matching subdirectory that exists out of the 10 standard folders (`sources/`, `strategy/`, `product/`, `engineering/`, `growth/`, `operations/`, `finance-legal/`, `ideas/`, `research/`, `customers/`). If unsure, map them logically to the corresponding department folder.

**File Naming & Slugification Rules:**
- **Kebab-case filenames:** Lowercase all filenames, replace spaces with hyphens, remove special characters, and trim to a reasonable length. E.g., `ai-skin-analysis.md`.
- **YAML Frontmatter Standards:** Every page must begin with this exact YAML schema:
  ```yaml
  ---
  title: "Readable Page Title"
  tags: [sales-crm, customer-feedback]
  sources: [raw-source-filename.md]
  last_updated: YYYY-MM-DD
  ---
  ```

### Step 6: Add Wikilinks (Strict Link Resolution Guardrail)
Ensure all related pages link to each other using Obsidian `[[wikilink]]` syntax. Every mention of an entity or concept that has its own page should be linked.

> [!WARNING]
> **CRITICAL LINK INDEXING GUARDRAIL:**
> Do **NOT** wrap double-bracket links in backticks (e.g., write `[[Page Title]]`, **NEVER** `[[Page Title]]` inside backticks). Wrapping links in backticks turns them into inline code blocks, which completely prevents Obsidian from indexing them or showing them as connected nodes in the Graph View! Always output raw links like `[[Page Title]]` so they show up beautifully in your Graph View.

**Link Syntax Rules:**
- Do not append the `.md` extension inside the brackets (e.g. use `[[product-roadmap]]`, not `[[product-roadmap.md]]`).
- Do not include directory prefixes (e.g. use `[[technical-architecture]]`, not `[[engineering/technical-architecture]]`). Obsidian resolves links globally.
- You can use the page's actual **Title Case** title inside the brackets (e.g., `[[Entity Name]]` or `[[Concept Name]]`). Obsidian will map it to `entity-name.md`.
- **No Orphan Pages:** Every page must be linked from at least one existing page. If you link to a concept that does not exist yet, you **MUST** create a brief 3-line "stub" page for it inside the correct tag-based subdirectory with basic frontmatter so the link is not broken.

### Step 7: Update wiki/index.md
For each new or updated wiki page, add/verify its entry under the appropriate category header in `wiki/index.md` in the format:
`- [[Page Name]] — one-line summary (under 120 characters)`

### Step 8: Update wiki/log.md
Record the ingestion in `wiki/log.md` by appending:
```markdown
## [YYYY-MM-DD] ingest | source-filename.md
Processed source-filename.md. Created N new pages, updated M existing pages.
New entities/concepts: [[Entity1]], [[Concept1]].
```
> [!IMPORTANT]
> **Strict Log Header Convention:** You MUST format the section header exactly as `## [YYYY-MM-DD] ingest | source-filename.md` with the exact raw source filename after the pipe. This allows Step 2 to robustly parse previously processed files by scanning the headers of `wiki/log.md`.


### Step 9: Report Results
Present a clean, high-quality, professional summary to the user outlining:
1. **Pages Created**: Clickable double-bracket links to the newly created files.
2. **Pages Updated**: Details of existing files updated with new intelligence.
3. **Redacted Secrets**: List of any sensitive items that were successfully masked during ingestion.
4. **Action Items Discovered**: List of any `[ ]` action items extracted.

---

## Conventions
- Source summary pages are **factual only**. Save interpretation and synthesis for concept and synthesis pages.
- A single source typically touches **10–15 wiki pages**. This is normal and expected.
- When new information contradicts existing wiki content, **update the wiki page and note the contradiction** with both sources cited.
- **Prefer updating existing pages** over creating new ones. Only create a new page when the topic is distinct enough to warrant its own page.
- Use `[[wikilinks]]` for all internal references. Never use raw file paths in note contents.
- Never wrap links in backticks.