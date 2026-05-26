# 📏 LLM Wiki Pattern Architecture & Schema Rules

This document outlines the strict structural, naming, and stylistic conventions required to maintain a highly dense, consistent, and interlinked CortexOS (Second Brain). Every AI agent acting as the "Librarian" MUST adhere to these rules when creating or updating notes.

---

## 🏛️ Architecture

The CortexOS ( i.e. the Second Brain) is split into three main layers:
1. `raw/` - Raw web clippings, dump notes, meeting audio transcripts, or PDFs. Agents only read from here.
2. `wiki/` - Clean, highly structured, interlinked Markdown (`.md`) files containing synthesized knowledge.
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
last_updated: YYYY-MM-DD
---
```

### Allowed Tech-Startup Tags:
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

All wiki files should follow a highly structured, consistent visual layout:

### Heading 1: `# Readable Page Title`
Provide a clean title matching the frontmatter title.

### 🎯 Synthesis (TL;DR)
A dense 2-3 sentence overview explaining exactly what this note is, why it matters to the startup, and the current status.

### 💡 Key Takeaways & Insights
- Bullet points summarizing the absolute most critical points of intelligence.
- Must link outwards to related concepts using `[[kebab-case-link]]`.

### 🔍 Deep Dive & Content
Use structured Heading 2 (`##`) and Heading 3 (`###`) to expand on details. Keep paragraphs concise and dense.
Always interlink topics. If you mention `redis` and a page `[[redis]]` exists, link it!

### 📋 Action Items (If Applicable)
- [ ] List concrete next actions with assignees if known (e.g. `[ ] @designer update Figma mocks`).

### 📂 Sources & References
List the original raw files, URLs, or notes in `raw/` that were used to compile this wiki page:
- `[Raw File Name](file:///relative/path/to/raw/source)`
- `[Article Name](https://example.com/article)`

---

## 🔗 Wiki Linking (Interlinking) Rules

1. **Active Interlinking:** You must link concepts using Obsidian-style double brackets `[[concept-file-name]]`. Do not append the `.md` extension inside the brackets.
   - *Correct:* `[[product-roadmap]]`
   - *Incorrect:* `[[product-roadmap.md]]`
2. **No Orphan Pages:** Every new page must be linked from at least one existing page (such as `wiki/index.md` or a parent topic page).
3. **Stub Creation:** If you link to a concept that does not exist yet (e.g. `[[stripe-integration]]`), you must create a brief "stub" page for it with basic frontmatter so the link is not broken.
4. **Prevent Duplication:** Before creating any page, use `grep` or `glob` to search if a page on the topic already exists. If a similar topic exists, merge/update it instead of creating a duplicate.

---

## 🔒 Security & Data Privacy Guidelines

Since a business cortexOS ( ie a second brain) holds proprietary intellectual property, strategic plans, and sensitive user/partner data, all AI agents acting as the "Librarian" MUST adhere to these strict data handling guidelines:

1. **PII and Sensitive Info Masking:** Do NOT write raw personal identifiable information (e.g. passwords, API keys, private tokens, personal email lists, or phone numbers) into `wiki/` pages. If they appear in raw sources or transcripts, redact or mask them (e.g., `<masked-api-key>`).
2. **No Data Leakage:** Do NOT run arbitrary external commands or invoke unauthorized APIs that transmit vault contents outside the user's workspace.
3. **Strict Confidentiality:** When generating responses or wiki notes, maintain strict boundary lines: keep draft internal financials, strategic pitches, or customer records in appropriate protected notes, and do not reference them for external-facing summaries.
4. **Access Control & Git Ignore:** Ensure sensitive files (such as local `.env` files, databases, or draft cap tables) are kept in protected folders within `raw/` and that the `.gitignore` explicitly prevents them from being pushed to public source repositories.
