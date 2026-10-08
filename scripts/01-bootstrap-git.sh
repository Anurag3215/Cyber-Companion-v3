#!/usr/bin/env bash
# Creates: main -> develop -> first feature branch (Phase 1).
set -euo pipefail
[ -d .git ] || git init -b main
git add -A
git commit -m "chore: initial project scaffold" || true
git branch -f develop main
git checkout develop
git checkout -b feature/p1-repo-bootstrap
echo "Done. Branches:"; git branch
echo "Next: create GitHub repo, then: git remote add origin <url> && git push -u origin main develop"
