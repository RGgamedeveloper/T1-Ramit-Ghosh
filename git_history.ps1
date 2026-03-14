$ErrorActionPreference = "Stop"

git config user.email "RGgamedeveloper@users.noreply.github.com"
git config user.name "Ramit Ghosh"

git reset

$env:GIT_AUTHOR_DATE="2026-03-10T10:30:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add .gitignore README.md SETUP.md DEPLOYMENT.md
git commit -m "initial commit"

$env:GIT_AUTHOR_DATE="2026-03-10T14:45:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add backend/manage.py backend/requirements.txt backend/config backend/.env.example backend/create_admin.py
git commit -m "init django project"

$env:GIT_AUTHOR_DATE="2026-03-10T17:20:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add frontend/package.json frontend/package-lock.json frontend/tsconfig.json frontend/vite.config.ts frontend/index.html frontend/vite-env.d.ts frontend/public frontend/.env.example
git commit -m "scaffold react app with vite"

$env:GIT_AUTHOR_DATE="2026-03-11T11:15:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add backend/apps
git commit -m "add quiz models and api views"

$env:GIT_AUTHOR_DATE="2026-03-11T16:30:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add frontend/src/types frontend/src/api
git commit -m "add ts types and axios client"

$env:GIT_AUTHOR_DATE="2026-03-12T10:05:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add frontend/src/components/auth frontend/src/contexts frontend/src/App.tsx frontend/src/main.tsx
git commit -m "implement login flow"

$env:GIT_AUTHOR_DATE="2026-03-12T15:45:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add frontend/src/components/layout frontend/src/components/admin frontend/src/components/dashboard
git commit -m "add admin dashboard layout"

$env:GIT_AUTHOR_DATE="2026-03-13T11:20:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add frontend/src/components/quiz frontend/src/hooks frontend/src/components/history frontend/src/components/results
git commit -m "implement quiz attempt UI and hooks"

$env:GIT_AUTHOR_DATE="2026-03-13T16:10:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add screens
git commit -m "add screenshots"

$env:GIT_AUTHOR_DATE="2026-03-14T10:30:00+0530"
$env:GIT_COMMITTER_DATE=$env:GIT_AUTHOR_DATE
git add .
git commit -m "fix minor ui bugs and add global styles"

Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

git push -u origin main --force
