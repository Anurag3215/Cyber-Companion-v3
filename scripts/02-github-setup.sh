#!/usr/bin/env bash
# Needs: gh CLI logged in (gh auth login), repo already pushed. Usage: ./02-github-setup.sh OWNER/REPO
set -euo pipefail
source "$(dirname "$0")/phases.sh"
REPO="${1:?usage: $0 OWNER/REPO}"

# 1) Labels (branch types)
for l in feature:0e8a16 update:1d76db bugfix:d73a4a security:b60205 chore:cfd3d7 docs:0075ca release:5319e7 hotfix:e99695; do
  gh label create "${l%%:*}" --color "${l##*:}" --repo "$REPO" --force
done

# 2) Milestone + tracking issue per phase
for p in "${PHASES[@]}"; do
  IFS='|' read -r n slug ver name <<<"$p"
  gh api repos/"$REPO"/milestones -f title="Phase $n – $name" -f description="Target tag: $ver" >/dev/null || true
  gh issue create --repo "$REPO" --title "[Phase $n] $name" \
    --label feature --milestone "Phase $n – $name" \
    --body "Exit criteria: see MASTER_PROMPT §10. Branch: \`feature/p$n-*\`  Release: \`$ver\`" || true
done

# 3) Protect main & develop
for b in main develop; do
  gh api -X PUT repos/"$REPO"/branches/$b/protection --input - <<JSON
{
  "required_status_checks": {"strict": true, "contexts": ["lint-typecheck-test"]},
  "enforce_admins": true,
  "required_pull_request_reviews": {"required_approving_review_count": 1, "require_code_owner_reviews": true},
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
done

# 4) Squash-only merges, auto-delete merged branches
gh api -X PATCH repos/"$REPO" -F allow_squash_merge=true -F allow_merge_commit=false \
  -F allow_rebase_merge=false -F delete_branch_on_merge=true >/dev/null
echo "Done. Also enable secret scanning + push protection in Settings > Security."
echo "Solo dev: set required approvals to 0 if GitHub blocks self-approval."
