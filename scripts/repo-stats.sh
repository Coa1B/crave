#!/usr/bin/env bash
# Counts facts about the project straight from git and the code, so nothing is guessed.
#   ./scripts/repo-stats.sh [branch]      (default: origin/main)
# Needs git; the pull request counts also need the GitHub CLI (gh) to be logged in.

set -euo pipefail
cd "$(dirname "$0")/.."

REF="${1:-origin/main}"
git fetch -q origin 2>/dev/null || true

count_lines() { git ls-tree -r --name-only "$REF" -- "$1" | grep -E "$2" | xargs -I{} git show "$REF:{}" | wc -l | tr -d ' '; }
count_files() { git ls-tree -r --name-only "$REF" -- "$1" | grep -Ec "$2" || true; }

first=$(git log "$REF" --reverse --format=%as | head -1)
last=$(git log "$REF" -1 --format=%as)
days=$(( ( $(date -j -f %Y-%m-%d "$last" +%s) - $(date -j -f %Y-%m-%d "$first" +%s) ) / 86400 + 1 ))

echo "## Repo stats for $REF (generated $(date +%Y-%m-%d))"
echo
echo "| Stat | Value |"
echo "| --- | --- |"
echo "| First commit | $first |"
echo "| Latest commit | $last |"
echo "| Days from first to latest commit | $days |"
echo "| Commits | $(git rev-list --count "$REF") |"
echo "| Contributors | $(git shortlog -sn "$REF" | wc -l | tr -d ' ') |"
echo "| Pull requests merged | $(gh pr list --state merged --limit 500 --json number -q length 2>/dev/null || echo n/a) |"
echo "| Pull requests open | $(gh pr list --state open --limit 500 --json number -q length 2>/dev/null || echo n/a) |"
echo "| Back end source files (backend/src, .ts) | $(count_files backend/src '\.ts$') |"
echo "| Back end source lines (backend/src, .ts) | $(count_lines backend/src '\.ts$') |"
echo "| Back end HTTP endpoints | $(git grep -hEc 'app\.(get|post|put|patch|delete)\(' "$REF" -- backend/src | paste -sd+ - | bc) |"
echo "| Socket.io events the server sends | $(git grep -hoE 'emit(ToGroup)?\([^)]*"[a-z_]+"' "$REF" -- backend/src | grep -oE '"[a-z_]+"' | sort -u | wc -l | tr -d ' ') |"
echo "| Test files | $(count_files . '(\.test\.|\.spec\.)') |"
echo "| Doc files (.md) | $(count_files . '\.md$') |"
echo
echo "Commits per person:"
echo
git shortlog -sn "$REF" | sed -E 's/^ *([0-9]+)\t(.*)/- \2: \1/'
