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

## Ingest Process (9-Step Workflow)

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
Do NOT hold back or summarize excessively to save tokens. You must aggressively scan the entire raw document and identify ALL possible **Entities** (people, competitor companies, partners, products, tools, e.g. `loreal`, `curology`) and **Concepts** (industry trends, tech frameworks, features, standard terms, e.g. `ai-skin-analysis`, `skinimalism`) mentioned in the raw source.
- Propose an exhaustive list of individual, highly focused **atomic pages** you plan to create or update. There is absolutely no arbitrary limit or upper cap on the number of nodes extracted from a single source file; a deep raw source should yield as many distinct atomic pages as are supported by the actual source content (e.g., as many proposed atomic pages/nodes per source file as necessary), split across multiple batch turns.
- Ask the user if they want to emphasize any particular aspects or skip any topics. **STOP and wait for user confirmation** before proceeding with the creation phase.

### Step 4: Enforce Ingestion Security Guardrails
During the transition from `raw/` to `wiki/`, actively audit the text for sensitive information:
- **PII and Secrets:** Redact or mask passwords, API keys, private tokens, database credentials, personal email lists, or phone numbers using clean placeholders (e.g., `<masked-api-key>`).
- **Strategic Privacy:** Keep financials, board drafts, or proprietary strategic details in appropriate protected tag categories (`finance-legal` or `strategy`).

### Step 5: Create or Update Wiki Pages (Hierarchical Subdirectory layout)
All wiki notes must live **inside the appropriate subdirectories** under the `wiki/` directory based on the active vault's scale and directory structure. **Do not compile files into a few broad department summaries.** Instead, split and atomize the knowledge into these page types.

> [!IMPORTANT]
> **EXHAUSTIVE EXTRACTION & THE TOKEN LIMIT BOTTLENECK:**
> A large or substantial source document (e.g., detailed reports, transcripts, research papers) must yield **as many atomic, deeply interlinked pages as there are distinct entities and concepts present in the text, with absolutely no arbitrary limits or upper caps** (e.g., as many pages from a single deep resource is fully expected if the content supports it). Do NOT prune, omit, or collapse separate entities/concepts into a single broad summary page to "save tokens" or speed up the process. A dense and granular knowledge graph is the ultimate goal.
> To prevent hitting your physical **output token limit (typically 4,096 tokens)** during massive multi-file creation, you MUST keep Entity and Concept pages **extremely brief, atomic, and focused (under 150-250 tokens per file)**:
> - **Source Summary Pages**: Placed in `wiki/sources/`. These are the master records and MUST use the structured layout standard containing dedicated **Entities Mentioned** and **Concepts Covered** sections to act as the master index.
> - **Entity & Concept Pages**: Placed in the corresponding department directories. These must use the atomic layout (YAML frontmatter + H1 + 1-2 dense paragraphs + mandatory `🔗 Related Nodes` section with 3-5 cross-links to other atomic pages + `📂 Sources`). Keep them concise but ALWAYS include cross-links!
> 
> **Incremental Ingestion Protocol (Handling Large Sources):**
> If the raw source yields more than 5–8 new or updated atomic pages (which it almost always should for any comprehensive document), you **MUST NOT** attempt to create/update all files in a single LLM response. Doing so will truncate your output and leave the vault corrupted. Instead, strictly proceed incrementally:
> 1. In your **first turn**, create the master **Source Summary Page** in `wiki/sources/<raw-filename>.md` containing the exhaustive lists of `Entities Mentioned` and `Concepts Covered` as double-bracket wikilinks, and output your proposed list of atomic Entity/Concept pages. Presenting these lists in the Source Summary Page creates the initial unlinked nodes in the Graph View and acts as a precise checklist for the subsequent creation turns.
> 2. Present this plan clearly to the user, and **STOP** to ask for confirmation to proceed.
> 3. Once approved, create or update the atomic pages in **batches of 5–8 files per turn**.
> 4. **Cross-link awareness per batch:** When writing each batch, you MUST:
>    - Include the mandatory `🔗 Related Nodes` section on every page with 3-5 links to **other atomic pages** (NOT just the source summary).
>    - Link new pages to **already-created pages** from previous batches wherever semantically relevant.
>    - Maintain a mental **cross-link backlog**: if a page from batch 1 should link to a page you're creating in batch 3, note it and update the batch 1 page in the current turn.
> 5. In each turn, list the files successfully written (including any previously-created files updated with new cross-links), then ask: *"Should I proceed with the next batch of 5–8 files?"*
> 6. Continue this batching pattern until the entire planned list of pages is successfully ingested.
> 7. After the **final batch**, perform a **Cross-Linking Sweep** (see Step 6b below).

1. **Source Summary Pages**: For every ingested raw source, create or update a dedicated summary file inside the `sources/` subdirectory (or equivalent research/notes subdirectory). Name it `wiki/sources/<raw-filename>.md`.
   Every Source Summary Page MUST follow this exact markdown template to ensure a complete, structured index of the source:
   ```markdown
   # Readable Source Title

   **Source:** <raw-filename>
   **Date ingested:** YYYY-MM-DD
   **Type:** article | paper | transcript | notes | etc.

   ## 🎯 Synthesis (TL;DR)
   A dense 2-3 sentence overview explaining exactly what this source is, its main thesis, and its relevance to the startup.

   ## 💡 Key Takeaways & Insights
   - Bullet points summarizing the absolute most critical points of intelligence.
   - Must link outwards to related concepts using `[[kebab-case-link]]`.

   ## 🔍 Deep Dive & Content
   Use structured Heading 2 (`##`) and Heading 3 (`###`) to expand on details. Keep paragraphs concise and dense. Always interlink topics.

   ## 🏛️ Entities Mentioned
   - [[Entity Name]] — brief context / relevance
   - [[Another Entity]] — brief context / relevance

   ## 🧠 Concepts Covered
   - [[Concept Name]] — brief context / relevance
   - [[Another Concept]] — brief context / relevance

   ## 📋 Action Items (If Applicable)
   - [ ] Concrete next action with assignee if known.

   ## 📂 Sources & References
   - [Raw File Name](file:///relative/path/to/raw/source)
   ```
2. **Entity Pages**: Create/update dedicated pages for each organization, tool, person, or competitor listed under **Entities Mentioned**. File them under the active subdirectory matching their primary department (e.g. `wiki/growth/` for competitors, `wiki/engineering/` for technical tools). Every Entity page MUST include the `🔗 Related Nodes` section with 3-5 cross-links to other atomic pages.
3. **Concept Pages**: Create/update dedicated pages for ideas, frameworks, features, or patterns listed under **Concepts Covered**. File them under the active subdirectory matching their category (e.g. `wiki/research/` for market trends, `wiki/product/` for product features). Every Concept page MUST include the `🔗 Related Nodes` section with 3-5 cross-links to other atomic pages.

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

### Step 6b: Cross-Linking Sweep *(After Final Batch)*
After ALL batches of atomic pages have been created, perform a dedicated cross-linking pass to catch links that couldn't be made during earlier batches (because target pages didn't exist yet):

1. **List all pages created** during this entire ingestion session.
2. **For each page**, read its `🔗 Related Nodes` section and verify it contains at least 3 links to other atomic pages. If fewer, identify and add missing related pages.
3. **Check bidirectionality**: If page A links to page B in its Related Nodes, page B should also link back to page A (unless they are unrelated). Update page B's Related Nodes section if needed.
4. **Scan for missed connections**: Look for obvious semantic relationships that were missed — e.g., two competitor companies that should link to each other, a regulation and the companies it affects, a technology and the products using it.
5. Report the cross-linking sweep results: *"Cross-linking sweep complete. Updated N pages with M new cross-links."*

> [!IMPORTANT]
> This sweep is the **most critical step** for graph density. Without it, pages from early batches will be under-linked because later pages didn't exist when they were written. Do NOT skip this step.

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
- A single source should be mined exhaustively for every possible entity and concept it contains: while a short note might touch 10–15 pages, a comprehensive raw document should yield as many atomic, deeply interlinked pages as the content naturally supports (e.g., 50 to 100+ pages from a single deep resource, scaling dynamically to thousands of nodes across the entire vault as more resources are ingested). Never limit node generation or compromise on graph density just to save tokens.
- When new information contradicts existing wiki content, **update the wiki page and note the contradiction** with both sources cited.
- **Prefer updating existing pages** over creating new ones if they represent the exact same entity/concept. Otherwise, create a new page to keep nodes highly atomic.
- Use `[[wikilinks]]` for all internal references. Never use raw file paths in note contents.
- Never wrap links in backticks.