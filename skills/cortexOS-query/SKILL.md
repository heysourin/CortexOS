---
name: cortexOS-query
description: >
  Answer questions against the tech startup knowledge base wiki. Use when the user
  asks a question about their collected company knowledge, wants to explore
  connections between departments, says "what do I know about X", or wants
  to search their startup wiki.
allowed-tools: Bash Read Write Edit Glob Grep
---

# Tech Startup Second Brain — Query

Answer questions by searching and synthesizing knowledge from the tech startup wiki.

## Search Strategy

### 1. Start with the index

Read `wiki/index.md` to identify relevant pages. Scan all tech startup categories for entries related to the question:
- **Strategy & Vision** (mission, pitches, vision)
- **Product & Engineering** (PRDs, roadmap, architecture)
- **Market & Competitors** (market research, matrices)
- **Sales & CRM** (playbooks, personas)
- **Finance & Legal** (fundraising, compliance)
- **Operations & People** (SOPs, hiring, meeting notes)

### 2. Use qmd for large wikis

If `qmd` is installed (check with `command -v qmd`), use it for search:

```bash
qmd search "query terms" --path wiki/
```

This is especially useful when the wiki has grown beyond ~100 pages where scanning the index becomes inefficient.

### 3. Read relevant pages

Read the wiki pages identified by the index or search. Follow `[[wikilinks]]` to pull in related context from linked pages. Read enough pages to give a thorough answer, but don't read the entire wiki.

### 4. Check raw sources if needed

If the wiki pages don't fully answer the question, check relevant source summaries in `wiki/sources/` for additional detail. Only go to raw files in `raw/` as a last resort.

## Synthesize the Answer

### Format

Match the answer format to the question:
- **Factual question** → direct answer with citations
- **Comparison** → table or structured comparison (e.g., competitor analysis)
- **Exploration** → narrative with linked concepts
- **List/catalog** → bulleted list with brief descriptions

### Citations

Always cite wiki pages using `[[wikilink]]` syntax. Example:

> According to [[product-roadmap]], our Q3 objectives focus on X. This aligns with our market positioning described in [[market-positioning]], which [[competitor-matrix]] also addresses.

### Offer to save valuable answers

If the answer produces something worth keeping — a comparison, analysis, new connection, or synthesis — offer to save it:

> "This comparison might be useful to keep in your wiki. Want me to save it as a synthesis page?"

If the user agrees:
1. Create a new page in `wiki/` (or `wiki/synthesis/`) with proper frontmatter and relevant tech-startup tags (e.g. `#strategy`, `#product-spec`).
2. Add an entry to `wiki/index.md` under the appropriate category section.
3. Append to `wiki/log.md`: `## [YYYY-MM-DD] query | Question summary`

## 🔒 Security & Confidentiality Guardrails

When querying and synthesizing knowledge, all agents MUST adhere to these strict data-safety laws:

1. **PII and Secret Protection:** Do NOT output personal raw data (passwords, private emails, phone numbers) or secret keys (API tokens, private endpoints) in synthesized query answers or saved wiki pages. Redact or mask them immediately (e.g., `<masked-api-key>`).
2. **Confidential Boundaries:** Respect internal business confidentiality. Never use raw financials, draft cap tables, or personal team records in responses designed for external or public-facing documentation.
3. **Local Processing Only:** Ensure no sensitive proprietary data is transmitted to untrusted external APIs when performing search operations.

## Conventions

- **Search the wiki first.** Only go to raw sources if the wiki doesn't have the answer.
- **Cite your sources.** Every factual claim should link to the wiki page it came from.
- **Valuable answers compound.** Encourage saving good analyses back into the wiki.
- Use `[[wikilinks]]` for all internal references. Never use raw file paths.

## Related Skills

- `/second-brain-ingest` — process new sources into wiki pages
- `/second-brain-lint` — health-check the wiki for issues