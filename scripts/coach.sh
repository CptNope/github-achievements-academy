#!/usr/bin/env bash
# GitHub Achievements Academy: guided coach.
# Explains each step, asks before acting, and does ONE thing at a time.
# There is intentionally no loop or "repeat N times" option. See FAIR-PLAY.md.
set -euo pipefail

bold=$'\e[1m'; dim=$'\e[2m'; green=$'\e[32m'; yellow=$'\e[33m'; red=$'\e[31m'; reset=$'\e[0m'

say()  { printf '%s\n' "$*"; }
step() { printf '\n%s▶ %s%s\n' "$bold" "$*" "$reset"; }
note() { printf '%s  %s%s\n' "$dim" "$*" "$reset"; }
ok()   { printf '%s✔ %s%s\n' "$green" "$*" "$reset"; }
warn() { printf '%s⚠ %s%s\n' "$yellow" "$*" "$reset"; }
die()  { printf '%s✖ %s%s\n' "$red" "$*" "$reset" >&2; exit 1; }

confirm() {
  local reply
  read -r -p "  Continue? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { say "  Okay, stopped. Nothing else was changed."; exit 0; }
}

need() { command -v "$1" >/dev/null 2>&1 || die "'$1' is not installed. See lessons/00-setup.md"; }

# Make sure we're in the learner's OWN sandbox repo, never this academy repo or someone else's.
require_sandbox() {
  need git; need gh
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Run this inside your sandbox repo (see Lesson 0, step 4)."
  local name owner me
  name=$(gh repo view --json name -q .name 2>/dev/null) || die "This folder isn't linked to a GitHub repo."
  owner=$(gh repo view --json owner -q .owner.login)
  me=$(gh api user -q .login)
  [[ "$name" != "github-achievements-academy" ]] || die "Please practice in your own sandbox repo, not the academy repo."
  [[ "${owner,,}" == "${me,,}" ]] || die "This repo belongs to '$owner'. Practice only in a repo you own."
  ok "Sandbox: $owner/$name"
}

cmd_help() {
  cat <<EOF
${bold}GitHub Achievements Academy coach${reset}

  ./scripts/coach.sh doctor      Check your Git identity and gh login       (Lesson 0)
  ./scripts/coach.sh quickdraw   Open an issue and triage it quickly         (Lesson 1)
  ./scripts/coach.sh yolo        Branch → commit → PR → self-merge           (Lesson 2)

Run quickdraw and yolo from inside ${bold}your own sandbox repo${reset}.
The coach shows each command and asks before it runs anything.
EOF
}

cmd_doctor() {
  need git
  step "Checking your Git identity"
  local email name
  name=$(git config --global user.name || true)
  email=$(git config --global user.email || true)
  [[ -n "$name" ]]  && ok "user.name  = $name"  || warn "user.name is not set:  git config --global user.name \"Your Name\""
  [[ -n "$email" ]] && ok "user.email = $email" || warn "user.email is not set: git config --global user.email you@example.com"

  step "Checking the GitHub CLI"
  if ! command -v gh >/dev/null; then warn "gh not installed (optional): https://cli.github.com"; return; fi
  if ! gh auth status >/dev/null 2>&1; then warn "Not logged in. Run: gh auth login"; return; fi
  ok "Logged in as $(gh api user -q .login)"

  if [[ -n "$email" ]]; then
    step "Checking that $email is verified on your account"
    if [[ "$email" == *@users.noreply.github.com ]]; then
      ok "You're using your GitHub no-reply address. That counts. 👍"
    elif verified=$(gh api user/emails -q '.[] | select(.verified) | .email' 2>/dev/null); then
      if grep -qix "$email" <<<"$verified"; then ok "Verified ✔"; else warn "Not found among your verified emails. Commits may not count! Check Settings → Emails."; fi
    else
      note "Couldn't read your emails (needs the user:email scope). Check Settings → Emails by hand,"
      note "or run: gh auth refresh -s user:email"
    fi
  fi
}

cmd_quickdraw() {
  require_sandbox
  say ""
  say "${bold}Lesson 1: Quickdraw${reset}"
  note "Scenario: you report a typo, then realize it's already fixed, so you close the issue as 'not planned'."
  note "Closing an issue within 5 minutes of opening it earns the one-time Quickdraw badge."

  step "1/2  Create the issue"
  note 'gh issue create --title "Typo in README" --body "The word \"teh\" appears in the intro."'
  confirm
  local url num
  url=$(gh issue create --title "Typo in README" --body 'The word "teh" appears in the intro.')
  num=${url##*/}
  ok "Opened issue #$num: $url"

  step "2/2  Triage it: close as not planned, with a reason"
  note "gh issue close $num --reason \"not planned\" --comment \"Already fixed in main, closing.\""
  note "Good triage always leaves a comment explaining WHY."
  confirm
  gh issue close "$num" --reason "not planned" --comment "Already fixed in main, closing."
  ok "Closed. The badge may take up to 24h to appear."
  say ""
  say "🧱 Next: tick Lesson 1 on your Learners Wall page (lessons/03-pull-shark.md)."
}

cmd_yolo() {
  require_sandbox
  local default branch
  default=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
  branch="practice/yolo-$(date +%Y%m%d-%H%M%S)"

  say ""
  say "${bold}Lesson 2: YOLO${reset}"
  note "You'll make a real change on a branch, open a PR, and merge it yourself with no review."

  [[ -z "$(git status --porcelain)" ]] || die "You have uncommitted changes. Commit or stash them first."

  step "1/5  Update $default and create a branch"
  note "git switch $default && git pull && git switch -c $branch"
  confirm
  git switch "$default" -q && git pull -q && git switch -c "$branch" -q
  ok "On branch $branch"

  step "2/5  Make a change and commit it"
  note "Appending a dated entry to LEARNING_LOG.md. It's a real record of your practice."
  confirm
  [[ -f LEARNING_LOG.md ]] || printf '# Learning log\n\n' > LEARNING_LOG.md
  printf -- '- %s: practiced the branch → PR → merge flow (Lesson 2)\n' "$(date +%Y-%m-%d)" >> LEARNING_LOG.md
  git add LEARNING_LOG.md
  git commit -q -m "docs: log Lesson 2 practice"
  ok "Committed: $(git log -1 --pretty=%s)"

  step "3/5  Push the branch"
  note "git push -u origin $branch"
  confirm
  git push -q -u origin "$branch"
  ok "Pushed"

  step "4/5  Open a pull request"
  note "gh pr create --fill"
  confirm
  gh pr create --fill --base "$default"

  step "5/5  Merge it yourself, with no review (the YOLO part 🤠)"
  note "gh pr merge --squash --delete-branch"
  note "On a team you'd wait for a review. Lesson 2 shows how to require one."
  confirm
  gh pr merge --squash --delete-branch
  git switch "$default" -q 2>/dev/null || true
  git pull -q
  ok "Merged! The badge may take up to 24h to appear."
  say ""
  say "🧱 Next: try the 'Bonus lesson: turn on protection' in lessons/02-yolo.md."
}

case "${1:-help}" in
  doctor)    cmd_doctor ;;
  quickdraw) cmd_quickdraw ;;
  yolo)      cmd_yolo ;;
  help|-h|--help) cmd_help ;;
  *) cmd_help; exit 1 ;;
esac
