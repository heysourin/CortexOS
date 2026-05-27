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

Read `wiki/index.md` to identify relevant pages. Scan all tech startup categories and their corresponding subdirectories (e.g. `wiki/engineering/`, `wiki/product/`, `wiki/operations/` etc.) for entries related to the question.

### 2. Prioritize Built-in Search Tools (Standard Grep / Ripgrep)

As an AI agent, you have highly optimized built-in search capabilities (such as standard `grep` or specific `grep_search` tools). Use these to perform high-speed recursive keyword searches across all subdirectories of `wiki/`. 

Example:
```bash
grep -ri "pricing matrix" wiki/
```

### 3. Check for User-Facing qmd Search (Optional Fallback)

If the user or project has configured the CLI search tool `qmd` (check with `command -v qmd`), you may use it for search:

```bash
qmd search "query terms" --path wiki/
```

This is especially helpful for the startup team when interacting via terminal, or as an alternative scanning tool.

### 4. Read relevant pages

Read the wiki pages identified by the index or search. Follow `[[wikilinks]]` (handling aliased links by splitting on `|`) to pull in related context from linked pages across all subfolders. Read enough pages to give a thorough answer, but don't read the entire wiki.

### 5. Check raw sources if needed

If the wiki pages don't fully answer the question, check relevant source summaries in your active `wiki/` subdirectories (e.g., under `wiki/research/`, `wiki/sources/`, or `wiki/operations/`) for additional detail. Only go to raw files in `raw/` as a last resort.

## Synthesize the Answer

### Format

Match the answer format to the question:
- **Factual question** → direct answer with citations
- **Comparison** → table or structured comparison (e.g., competitor analysis)
- **Exploration** → narrative with linked concepts
- **List/catalog** → bulleted list with brief descriptions

### Citations

Always cite wiki pages using `[[wikilink]]` syntax. Obsidian resolves links globally without directory prefixes, so cite pages cleanly. Example:

> According to [[product-roadmap]], our Q3 objectives focus on X. This aligns with our market positioning described in [[market-positioning]], which [[competitor-matrix]] also addresses.

### Offer to save valuable answers

If the answer produces something worth keeping — a comparison, analysis, new connection, or synthesis — offer to save it:

> "This comparison might be useful to keep in your wiki. Want me to save it as a synthesis page?"

If the user agrees:
1. Create a new page inside the appropriate subdirectory under `wiki/` (e.g., `wiki/strategy/` or `wiki/product/` or `wiki/operations/` based on its primary tag category) with proper frontmatter and relevant tech-startup tags.
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