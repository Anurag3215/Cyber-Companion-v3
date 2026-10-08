#!/usr/bin/env bash
# Usage: new-phase.sh <phase#> <type> <short-kebab>
# type = feature | update | fix | chore | docs | security
# e.g. new-phase.sh 3 feature qr-scanner-decode -> feature/p3-qr-scanner-decode
set -euo pipefail
n="${1:?phase}"; t="${2:?type}"; d="${3:?description}"
case "$t" in feature|update|fix|chore|docs|security) ;; *) echo "bad type"; exit 1;; esac
git checkout develop
git pull --ff-only 2>/dev/null || true
git checkout -b "$t/p$n-$d"
echo "On $t/p$n-$d. Use Conventional Commits, push, open PR -> develop (squash)."
