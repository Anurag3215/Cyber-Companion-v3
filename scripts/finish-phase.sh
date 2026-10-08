#!/usr/bin/env bash
# Cut a release branch after the phase gate passes. Usage: finish-phase.sh <phase#>
set -euo pipefail
source "$(dirname "$0")/phases.sh"
n="${1:?phase}"; ver=none; name=""
for p in "${PHASES[@]}"; do IFS='|' read -r pn slug v nm <<<"$p"; [ "$pn" = "$n" ] && { ver=$v; name=$nm; break; }; done
[ "$ver" = none ] && { echo "Optional/unknown phase: no tag assigned."; exit 0; }
git checkout develop
git pull --ff-only 2>/dev/null || true
git checkout -b "release/$ver"
git push -u origin "release/$ver"
cat <<MSG
Next:
 1) Final QA on release/$ver (fixes: fix/p$n-* -> release/$ver)
 2) PR release/$ver -> main (squash), merge when green
 3) git checkout main && git pull && git tag -a $ver -m "Phase $n complete: $name" && git push origin $ver
 4) PR main -> develop to sync back
MSG
