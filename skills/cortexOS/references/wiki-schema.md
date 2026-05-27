# 📏 LLM Wiki Pattern Architecture & Schema Rules

This document outlines the strict structural, naming, and stylistic conventions required to maintain a highly dense, consistent, and interlinked CortexOS (Second Brain). Every AI agent acting as the "Librarian" MUST adhere to these rules when creating or updating notes.

---

## 🏛️ Architecture

The CortexOS (i.e. the Second Brain) is split into three main layers:
1. `raw/` - Raw web clippings, dump notes, meeting audio transcripts, or PDFs. Agents only read from here.
2. `wiki/` - Clean, highly structured, interlinked Markdown (`.md`) files organized into exactly **10 permanent, static subdirectories**:
   - `wiki/sources/` — summaries of every raw document ingested ( provenance tracking).
   - `wiki/strategy/` — strategic goals, pitches, high-level roadmaps, and business opportunities.
   - `wiki/product/` — PRDs, specs, and design templates.
   - `wiki/engineering/` — technical architectures, code guidelines, schemas, and pipelines.
   - `wiki/growth/` — competitor research, sales playbooks, brand assets, and marketing campaigns.
   - `wiki/operations/` — SOPs, team sync notes, onboarding checklists, and hiring/talent specs.
   - `wiki/finance-legal/` — cap tables, incorporation records, compliance, and financials.
   - `wiki/ideas/` — unstructured brainstorms, creative hooks, and raw startup thoughts.
   - `wiki/research/` — general market research summaries, benchmarks, and landscape assessments.
   - `wiki/customers/` — feedback transcripts, customer journey maps, and user personas.
3. Configs & Rules - `CLAUDE.md` or `AGENTS.md` guiding the AI agent to follow this exact schema.

---

## 🏷️ File Naming Conventions

To ensure seamless multi-platform file system support and effortless wiki-linking, all files inside `wiki/` must follow these rules:
1. **Lowercase Only:** Avoid uppercase characters.
2. **Kebab-Case:** Use single hyphens `-` instead of spaces or underscores.
   - *Correct:* `technical-architecture.md`
   - *Incorrect:* `Technical Architecture.md`, `technical_architecture.md`
3. **No Special Characters:** No punctuation, brackets, or emojis in file names. Only alphanumeric characters and hyphens.

---

## 📝 Frontmatter Standards

Every page in `wiki/` must begin with standard YAML frontmatter:

```yaml
---
title: "Readable Page Title"
tags: [product-spec, engineering]
sources: [raw-source-filename.md]
last_updated: YYYY-MM-DD
---
```

### Allowed Core Tags:
- `strategy` - Business model, pitches, vision, core goals, investor updates.
- `product-spec` - Product Requirements Documents (PRDs), roadmap items, features.
- `engineering` - Code guidelines, system architectures, database designs.
- `competitor` - Competitor analysis, pricing structures, market research.
- `meeting` - Minutes of synchs, customer interviews, board meetings.
- `customer-feedback` - Feature requests, user testing transcripts, reviews.
- `marketing` - Brand guides, advertising metrics, copywriting.
- `sales-crm` - Pipeline tracking, deal notes, sales playbooks, customer personas.
- `finance-legal` - Pitch metrics, cap tables, incorporation documents, compliance, contracts.
- `hr-talent` - Hiring pipelines, job descriptions, employee onboarding, company policies.

---

## 📐 Layout Standards

To ensure readability and prevent AI output token exhaustion (allowing the extraction of 40+ atomic, deeply interlinked nodes from a single source), we distinguish between two layout standards:

> [!IMPORTANT]
> **Incremental / Batched Ingestion Protocol (Large Sources):**
> If a source document yields more than 5–8 new/updated atomic pages, you **MUST NOT** write all pages in a single turn, as it will hit physical output token limits (4,096 tokens). Proceed incrementally:
> 1. In your **first turn**, create ONLY the master **Source Summary Page** in `wiki/sources/` and output the proposed list of atomic Entity/Concept pages.
> 2. STOP and wait for the user's confirmation.
> 3. After approval, create/update atomic pages in **batches of 5–8 pages per turn**, asking to proceed before each subsequent batch.

### 1. Source Summary Pages Layout (Stored in `wiki/sources/`)
Used for master source summary files. These compile a comprehensive view of the source and MUST follow this exact structured layout standard:

#### Heading 1: `# Readable Source Title`
Provide a clean title matching the frontmatter title.

#### 🎯 Synthesis (TL;DR)
A dense 2-3 sentence overview explaining exactly what this source is, its main thesis, and its relevance to the startup.

#### 💡 Key Takeaways & Insights
- Bullet points summarizing the absolute most critical points of intelligence.
- Must link outwards to related concepts using `[[kebab-case-link]]`.

#### 🔍 Deep Dive & Content
Use structured Heading 2 (`##`) and Heading 3 (`###`) to expand on details. Keep paragraphs concise and dense. Always interlink topics.

#### 🏛️ Entities Mentioned
- [[Entity Name]] — brief context / relevance
- [[Another Entity]] — brief context / relevance

#### 🧠 Concepts Covered
- [[Concept Name]] — brief context / relevance
- [[Another Concept]] — brief context / relevance

#### 📋 Action Items (If Applicable)
- [ ] List concrete next actions with assignees if known.

#### 📂 Sources & References
- `[Raw File Name](file:///relative/path/to/raw/source)`

---

### 2. Entity & Concept Pages Layout (Stored in other subdirectories under `wiki/`)
To maximize graph density and scalability, individual Entity (person, competitor, partner, tool) and Concept (framework, trend, department strategy, feature) pages MUST be **atomic, highly focused, and brief** (under 100-150 words/tokens). This prevents the AI from hitting output token limits when writing 30-50+ pages.

#### Heading 1: `# Readable Page Title`
Matching the frontmatter title.

#### 📝 Description & Context (Dense 1-2 Paragraphs)
- Provide a concise definition, active state, and key details about this specific concept or entity.
- Do NOT write long deep-dives or duplicate information here. Keep it highly focused and direct.
- **Strictly active interlinking**: Bold or link relevant related concepts using `[[kebab-case-link]]` within the body sentences.

#### 📂 Sources & References
- `[[source-summary-page-name]]` (Wikilink to the master source summary page, e.g. `[[detailed-market-research]]`) or `[Raw File Name](file:///relative/path/to/raw/source)`.

---

## 🔗 Wiki Linking (Interlinking) Rules

1. **Active Interlinking:** You must link concepts using Obsidian-style double brackets `[[concept-file-name]]`. Do not append the `.md` extension inside the brackets.
   - *Correct:* `[[product-roadmap]]`
   - *Incorrect:* `[[product-roadmap.md]]`
2. **Obsidian Aliased Links Support:** Obsidian supports aliased links in the form `[[Target Page|Display Text]]`. 
   - When writing links, you may use aliases if they make sentences flow more naturally.
   - When parsing or resolving links (e.g., during linting or searching), always split the link text by the pipe `|` symbol and validate only the left-hand target page name.
3. **NO BACKTICKS AROUND LINKS:** 
   > [!WARNING]
   > Do **NOT** wrap double-bracket links in backticks (e.g. `` `[[concept]]` ``). Backticks convert the reference to inline code, which completely prevents Obsidian from indexing the link or rendering connections in the Graph View!
4. **No Orphan Pages:** Every new page must be linked from at least one existing page (such as `wiki/index.md` or a parent topic page).
5. **Stub Creation:** If you link to a concept that does not exist yet (e.g. `[[stripe-integration]]`), you must create a brief "stub" page for it with basic frontmatter so the link is not broken.
6. **Prevent Duplication:** Before creating any page, use `grep` or `glob` to search if a page on the topic already exists. If a similar topic exists, merge/update it instead of creating a duplicate.

---

## 🔒 Security & Data Privacy Guidelines

Since a business cortexOS ( ie a second brain) holds proprietary intellectual property, strategic plans, and sensitive user/partner data, all AI agents acting as the "Librarian" MUST adhere to these strict data handling guidelines:

1. **PII and Sensitive Info Masking:** Do NOT write raw personal identifiable information (e.g. passwords, API keys, private tokens, personal email lists, or phone numbers) into `wiki/` pages. If they appear in raw sources or transcripts, redact or mask them (e.g., `<masked-api-key>`).
2. **No Data Leakage:** Do NOT run arbitrary external commands or invoke unauthorized APIs that transmit vault contents outside the user's workspace.
3. **Strict Confidentiality:** When generating responses or wiki notes, maintain strict boundary lines: keep draft internal financials, strategic pitches, or customer records in appropriate protected notes, and do not reference them for external-facing summaries.
4. **Access Control & Git Ignore:** Ensure sensitive files (such as local `.env` files, databases, or draft cap tables) are kept in protected folders within `raw/` and that the `.gitignore` explicitly prevents them from being pushed to public source repositories.
