---
name: cortexOS-lint
description: >
  Health-check the tech startup wiki for contradictions, orphan pages, stale claims,
  security leaks, and missing cross-references. Use when the user says "audit",
  "health check", "lint", "find problems", or wants to improve corporate wiki quality.
allowed-tools: Bash Read Write Edit Glob Grep
---

# Tech Startup CortexOS — Lint

Health-check the startup wiki and report issues with actionable fixes, ensuring high density, connectivity, and strict security compliance.

## Audit Steps

Run all checks below, then present a consolidated report.

### 1. Broken wikilinks

Scan all wiki pages recursively across all subfolders for `[[wikilink]]` references. For each link, verify the target page exists *anywhere* in the `wiki/` subdirectory hierarchy (Obsidian resolves links globally, so the target page could reside in a different subfolder than the source page). Report any broken links.

```bash
# Find all wikilinks across wiki pages recursively
grep -roh '\[\[[^]]*\]\]' wiki/ | sort -u
```

Cross-reference against actual files found recursively in `wiki/`.

### 2. Orphan pages

Find pages with no inbound links — no other page references them via `[[wikilink]]`.

For each `.md` file in `wiki/` and all its active scale subfolders:
- Extract the page name (filename without extension)
- Search all other wiki pages recursively for `[[Page Name]]`
- If no other page links to it, it's an orphan

### 3. Contradictions

Read pages that share entities or concepts and look for conflicting claims. Flag when:
- Two source summaries make opposing claims about the same market topic
- An entity or product spec contains information that conflicts with raw customer feedback
- Dates, figures, revenue numbers, or competitor details differ between pages

### 4. Stale claims

Cross-reference source dates with wiki content. Flag when:
- A product spec cites only old technical specs and newer ones exist
- Competitor pricing or market share info hasn't been updated despite newer sources existing

### 5. Missing pages

Scan for `[[wikilinks]]` that point to pages that don't exist yet. These are topics the wiki mentions but hasn't given their own page. Assess whether they warrant a page.

### 6. Missing cross-references

Find pages that discuss the same topics but don't link to each other. Look for:
- Sales playbooks that mention products without linking them
- Technical architectures that mention APIs without linking them
- Source summaries that cover the same competitor but don't reference each other

### 7. Index consistency

Verify `wiki/index.md` is complete and accurate:
- Every page in your active subdirectories has an index entry
- No index entries point to deleted pages
- Entries are under the correct department or folder header

### 8. Data gaps

Based on the wiki's current coverage, suggest:
- Key business topics mentioned frequently but lacking depth (e.g., pricing, scaling)
- Technical questions the wiki can't answer well
- Areas where a web search or browser clip could fill in missing market intelligence

### 9. 🔒 Security & Data Privacy Audit

Scan all files recursively inside the `wiki/` directory and all its subfolders to ensure strict compliance with company data governance:
- **Plaintext Secrets:** Search for patterns indicating exposed credentials (e.g., `API_KEY=`, `password:`, `secret=`, `bearer `, `ssh-rsa`). Flag any plaintext credentials for immediate redacting/masking.
- **Unmasked PII:** Scan for unmasked raw personal details (passwords, private emails, phone numbers) that should be redacted or masked (e.g. `<masked-email>`).
- **Git-Ignore Breaches:** Verify that no local `.env` files, draft revenue sheets, cap tables, or database files are tracked inside the shared public folders.

## Report Format

Present findings grouped by severity:

### Errors (must fix)
- **Security Violations** (plaintext API keys, credentials, exposed PII)
- Broken wikilinks
- Contradictions between business metrics or strategies
- Index entries pointing to missing pages

### Warnings (should fix)
- Orphan pages with no inbound links
- Stale claims from outdated competitor or tech specs
- Missing pages for frequently referenced startup topics

### Info (nice to fix)
- Potential cross-references to add
- Data gaps that could be filled
- Index entries that could be more descriptive

For each finding, include:
- **What:** description of the issue
- **Where:** the specific file(s) and line(s)
- **Fix:** what to do about it

## After the Report

Ask the user:
> "Found N errors, N warnings, and N info items (including N security flags). Want me to fix any of these?"

If the user agrees, fix issues and report what changed.

## Log the lint pass

Append to `wiki/log.md`:

    ## [YYYY-MM-DD] lint | Health check
    Found N errors, N warnings, N info items. Fixed: [list of security and link fixes applied].

## When to Lint

- **After every 10 ingests** — catches cross-reference and tag gaps while they're fresh
- **Monthly at minimum** — catches stale claims, security leaks, and orphan pages over time
- **Before major queries** — ensures the wiki is healthy and secure before you rely on it for analysis

## Related Skills

- `/cortexOS-ingest` — process new sources into wiki pages
- `/cortexOS-query` — ask questions against the wiki