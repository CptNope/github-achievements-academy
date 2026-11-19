#!/usr/bin/env bash
# Builds a tiny throwaway Git repo with a merge conflict waiting in it, for Git lesson 3.
# Runs entirely on your computer. It never contacts GitHub and never touches your other repos.
set -euo pipefail

dir="${1:-${TMPDIR:-/tmp}/git-conflict-practice}"
dir="${dir%/}"

if [[ -e "$dir" ]]; then
  echo "✖ $dir already exists. Delete it first, or pass another path: $0 /some/other/path" >&2
  exit 1
fi

mkdir -p "$dir"
cd "$dir"
git init -q -b main
# Local-only identity for this practice repo, so it never needs your real settings.
git config user.name "Practice"
git config user.email "practice@example.com"

cat > menu.md <<'EOF'
# Welcome to the Blue Cafe!

Open every day from 8am to 4pm.

## Today's special
Pancakes with maple syrup
EOF
git add menu.md
git commit -q -m "Add cafe menu"

git switch -q -c rename-cafe
sed -i.bak 's/Blue Cafe/Green Cafe/' menu.md && rm -f menu.md.bak
git commit -q -am "Rename the cafe to Green Cafe"

git switch -q main
sed -i.bak 's/Blue Cafe!/Blue Cafe \& Bakery!/; s/Pancakes with maple syrup/Blueberry waffles/' menu.md && rm -f menu.md.bak
git commit -q -am "Add bakery to the name and change today's special"

cat <<EOF

✔ Practice repo ready at: $dir

  Both branches changed the same line (the cafe's name), so merging will conflict.
  The special changed only on main, so Git will merge that part by itself.

  Try it:
    cd "$dir"
    git log --oneline --graph --all
    git merge rename-cafe          # → CONFLICT in menu.md
    git status                     # Git tells you what to do next

  Then open menu.md, decide on the name, remove the <<<<<<< ======= >>>>>>> lines,
  and run:  git add menu.md && git commit

  Done? Delete the folder:  rm -rf "$dir"
EOF
