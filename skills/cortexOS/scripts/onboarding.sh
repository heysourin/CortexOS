#!/usr/bin/env bash
# onboarding.sh - Scaffolds an Obsidian vault using the LLM Wiki pattern

# Lines 4–29 (The Path Finder): Checks to make sure the AI gave the script a valid folder name, and finds exactly where on your Mac to build it (e.g., converting the shortcut ~ to /Users/yourname/).
set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "Error: Missing vault path argument."
    echo "Usage: $0 <vault-path>"
    exit 1
fi

RAW_PATH="$1"

# Resolve path (handle ~ and relative paths)
resolve_path() {
    local target="$1"
    if [[ "$target" == "~"* ]]; then
        target="${HOME}${target#~}"
    fi
    # Resolve relative to current directory if not absolute
    if [[ "$target" != /* ]]; then
        target="$(pwd)/$target"
    fi
    echo "$target"
}

# ---
# Lines 31–36 (The Builder): Creates your folders. It builds two empty folders inside the main vault folder: raw/ (where messy research goes) and wiki/ (where clean, organized knowledge lives).
VAULT_PATH="$(resolve_path "$RAW_PATH")"
VAULT_NAME="$(basename "$VAULT_PATH")"

echo "========================================="
echo "   Scaffolding cortexOS: $VAULT_NAME"
echo "   Target Path: $VAULT_PATH"
echo "========================================="

# 1. Create directory structure
mkdir -p "$VAULT_PATH/raw"
mkdir -p "$VAULT_PATH/wiki"

# Shift the vault path argument, so that $@ contains the subdirectory names
shift

# Create subdirectories recursively
for sub in "$@"; do
    mkdir -p "$VAULT_PATH/wiki/$sub"
done

# 2. Scaffold wiki/index.md: Writes out the standard homepage markdown text dynamically adapted to the active directory structure.
INDEX_FILE="$VAULT_PATH/wiki/index.md"
if [ ! -f "$INDEX_FILE" ]; then
    cat << 'EOF' > "$INDEX_FILE"
# 🧠 cortexOS Wiki

Welcome to your structured, compiled knowledge base. This wiki serves as a single source of truth for your tech startup's intellectual property, operational guidelines, and market intelligence.

---

## 🗺️ Index & Navigation
EOF

    for sub in "$@"; do
        # Format the folder name beautifully (e.g. engineering/backend -> Engineering / Backend, founder-notes -> Founder Notes)
        formatted_name=$(echo "$sub" | sed 's/-/ /g' | sed 's/\// \/ /g' | awk '
        {
            for(i=1;i<=NF;i++) {
                # Capitalize first letter of each word
                first=toupper(substr($i,1,1))
                rest=substr($i,2)
                $i=first rest
            }
            print
        }')
        
        # Add section header and stub placeholder link
        echo "" >> "$INDEX_FILE"
        echo "### 📂 $formatted_name" >> "$INDEX_FILE"
        echo "*(Add relevant notes in \`wiki/$sub/\`)*" >> "$INDEX_FILE"
    done

    cat << 'EOF' >> "$INDEX_FILE"

---

## 🏷️ Popular Tags
- `#strategy` • `#product-spec` • `#engineering` • `#competitor` • `#meeting` • `#customer-feedback` • `#marketing` • `#sales-crm` • `#finance-legal` • `#hr-talent`

---

> [!NOTE]
> This wiki is designed for **progressive compilation**. Drop raw research, notes, or web clippings in `raw/`, then let your LLM Librarian ingest and integrate them here.
EOF
    echo "✅ Created $INDEX_FILE"
else
    echo "⚠️ $INDEX_FILE already exists. Skipping."
fi

# 3. Scaffold wiki/log.md: Writes out a simple changelog file for the vault.
LOG_FILE="$VAULT_PATH/wiki/log.md"
if [ ! -f "$LOG_FILE" ]; then
    cat << 'EOF' > "$LOG_FILE"
# 📝 Vault Log & Changelog

Track all manual and automated compilations, schema updates, and structure changes in the vault.

---

## [2026-05-23] setup | Vault initialized
Created vault structure for tech startup cortexOS.
- Initialized directory structures: `raw/`, `wiki/`
- Created standard `wiki/index.md` index
- Created standard `wiki/log.md` changelog
- Pre-configured tags: `#strategy`, `#product-spec`, `#engineering`, `#competitor`, `#meeting`, `#customer-feedback`, `#marketing`, `#sales-crm`, `#finance-legal`, `#hr-talent`
EOF
    echo "✅ Created $LOG_FILE"
else
    echo "⚠️ $LOG_FILE already exists. Skipping."
fi

echo "========================================="
echo "✅ Directory Scaffolding Complete!"
echo "========================================="
