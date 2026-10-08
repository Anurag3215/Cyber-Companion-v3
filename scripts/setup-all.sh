#!/usr/bin/env bash
# ONE-FILE SETUP: run "bash setup-all.sh" inside your project folder. It creates every file, then sets up git branches.
set -e
mkdir -p "scripts"
cat > "scripts/phases.sh" <<'CC_EOF_MARKER'
# Shared phase map: "number|slug|version|name"
PHASES=(
"1|requirements-repo|v0.1.0|Requirement Analysis + Repo Foundation"
"2|design-ux|v0.1.0|System Design + UX"
"3|core-dev|v0.2.0|Core Development"
"4|threat-intel|v0.3.0|Threat Intelligence Integration"
"5|scoring|v0.4.0|Security Scoring Engine"
"6|awareness|v0.5.0|Cyber Awareness + Notifications"
"7|qa-release|v1.0.0|Testing, QA, Hardening & Release"
"8|admin|none|Admin Console (optional)"
"9|ai-explainer|none|AI Explainer RAG (optional)"
)
CC_EOF_MARKER
mkdir -p "scripts"
cat > "scripts/01-bootstrap-git.sh" <<'CC_EOF_MARKER'
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
CC_EOF_MARKER
mkdir -p "scripts"
cat > "scripts/02-github-setup.sh" <<'CC_EOF_MARKER'
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
CC_EOF_MARKER
mkdir -p "scripts"
cat > "scripts/new-phase.sh" <<'CC_EOF_MARKER'
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
CC_EOF_MARKER
mkdir -p "scripts"
cat > "scripts/finish-phase.sh" <<'CC_EOF_MARKER'
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
CC_EOF_MARKER
mkdir -p ".github"
cat > ".github/PULL_REQUEST_TEMPLATE.md" <<'CC_EOF_MARKER'
## What & why
## Phase / issue
Phase: P_  · Closes #
## Screenshots / GIFs (UI)
## Tests added
- [ ] Unit  - [ ] API/contract  - [ ] E2E (if flow changed)
## Security checklist
- [ ] Input validated (Zod)  - [ ] No secrets/keys  - [ ] SSRF considered
- [ ] No PII (URLs, SSIDs, app lists) in logs/analytics  - [ ] Permissions minimal
## Accessibility check
- [ ] Labels, 48dp targets, contrast, font scaling
## Breaking changes?
CC_EOF_MARKER
mkdir -p ".github"
cat > ".github/CODEOWNERS" <<'CC_EOF_MARKER'
/apps/api/               @YOUR_GITHUB_USERNAME
/packages/scoring-core/  @YOUR_GITHUB_USERNAME
/.github/                @YOUR_GITHUB_USERNAME
CC_EOF_MARKER
mkdir -p ".github"
cat > ".github/dependabot.yml" <<'CC_EOF_MARKER'
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule: { interval: weekly }
    target-branch: develop
  - package-ecosystem: github-actions
    directory: "/"
    schedule: { interval: weekly }
    target-branch: develop
CC_EOF_MARKER
mkdir -p ".github/workflows"
cat > ".github/workflows/ci.yml" <<'CC_EOF_MARKER'
name: ci
on:
  pull_request:
    branches: [develop, main]
jobs:
  lint-typecheck-test:   # must match the required check name in branch protection
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci --if-present
      - run: npm run lint --if-present
      - run: npm run typecheck --if-present
      - run: npm test --if-present
  branch-name:
    runs-on: ubuntu-latest
    steps:
      - name: Enforce branch naming
        env:
          BRANCH: ${{ github.head_ref }}
        run: |
          echo "$BRANCH" | grep -Eq '^(feature|update|fix|chore|docs|security|release|hotfix)/' || { echo "Bad branch name: $BRANCH"; exit 1; }
CC_EOF_MARKER
mkdir -p "."
cat > "commitlint.config.js" <<'CC_EOF_MARKER'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: { 'header-max-length': [2, 'always', 72] },
};
CC_EOF_MARKER
mkdir -p "docs"
cat > "docs/BRANCHING.md" <<'CC_EOF_MARKER'
# Branching & Version Control

```
main     ── v0.1.0 ───── v0.2.0 ───── v0.3.0 ... v1.0.0    (tagged, always releasable)
              ▲             ▲
         release/v0.1.0  release/v0.2.0                     (stabilise a phase)
develop  ── integration of every phase ─────────────────
  ▲  ▲  ▲
  │  │  └─ fix/pN-*      bug fixes
  │  └──── update/pN-*   improvements to existing features
  └─────── feature/pN-*  new work
  (also chore/*, docs/*, security/*; hotfix/* branches from main)
```

Naming: `<type>/p<phase>-<kebab-description>` e.g. `feature/p3-qr-scanner-decode`

## Per-phase loop
1. `scripts/new-phase.sh N feature <name>` → work → Conventional Commits.
2. Push, PR → `develop`, squash-merge once CI + review pass (branch auto-deletes).
3. Repeat feature / update / fix branches until the phase exit criteria pass.
4. `scripts/finish-phase.sh N` → `release/vX.Y.0` → PR → `main` → annotated tag → PR `main` → `develop`.

| Phase | Tag |
|---|---|
| 1–2 | v0.1.0 |
| 3 | v0.2.0 |
| 4 | v0.3.0 |
| 5 | v0.4.0 |
| 6 | v0.5.0 |
| 7 | v1.0.0 |
| 8–9 (optional) | none until you decide |

Commits: `feat(url): add homograph detection` · `fix(qr): handle empty payload` · `security(api): block private IP ranges`

Rules: no direct commits to `main`/`develop`; squash merges only; no force-push; no secrets ever.
CC_EOF_MARKER
echo "Files created. Now running git setup..."
bash scripts/01-bootstrap-git.sh
