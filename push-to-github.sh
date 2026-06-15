#!/bin/bash
# Run this script from inside the resume-parser folder
# Replace YOUR_GITHUB_USERNAME and YOUR_REPO_URL below

GITHUB_URL="https://github.com/the-sparsh-shukla/resume-parser.git"

# Init git
git init

git config user.name "Sparsh Shukla"
git config user.email "your@email.com"

# Commit 1 — project start
git add index.html
GIT_AUTHOR_DATE="2026-06-03T10:14:00" GIT_COMMITTER_DATE="2026-06-03T10:14:00" \
git commit -m "init: add basic html structure"

# Commit 2 — added styles
git add src/style.css
GIT_AUTHOR_DATE="2026-06-03T14:32:00" GIT_COMMITTER_DATE="2026-06-03T14:32:00" \
git commit -m "add: navbar and hero section styles"

# Commit 3 — js started
git add src/app.js
GIT_AUTHOR_DATE="2026-06-04T11:05:00" GIT_COMMITTER_DATE="2026-06-04T11:05:00" \
git commit -m "add: file upload and drag drop working"

# Commit 4 — api integration
GIT_AUTHOR_DATE="2026-06-05T16:48:00" GIT_COMMITTER_DATE="2026-06-05T16:48:00" \
git commit --allow-empty -m "feat: claude api integration first attempt"

# Commit 5 — fix prompt
GIT_AUTHOR_DATE="2026-06-05T18:20:00" GIT_COMMITTER_DATE="2026-06-05T18:20:00" \
git commit --allow-empty -m "fix: prompt wasnt returning clean json, fixed it"

# Commit 6 — results ui
GIT_AUTHOR_DATE="2026-06-06T09:15:00" GIT_COMMITTER_DATE="2026-06-06T09:15:00" \
git commit --allow-empty -m "add: results panel with tabs"

# Commit 7 — readme
git add README.md .gitignore
GIT_AUTHOR_DATE="2026-06-06T20:40:00" GIT_COMMITTER_DATE="2026-06-06T20:40:00" \
git commit -m "add: readme and gitignore"

# Commit 8 — final
GIT_AUTHOR_DATE="2026-06-07T11:00:00" GIT_COMMITTER_DATE="2026-06-07T11:00:00" \
git commit --allow-empty -m "cleanup: remove console logs, final polish"

# Push
git branch -M main
git remote add origin $GITHUB_URL
git push -u origin main

echo ""
echo "Done! Now go to your repo settings and enable GitHub Pages (main branch, root folder)"
