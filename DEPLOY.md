# Deployment Guide — Workday AI Readiness Assessment

## Project structure

```
/
├── index.html          ← The full app (single file, no build step)
├── vercel.json         ← Vercel static site config
├── .gitignore
└── DEPLOY.md           ← This file
```

---

## Option A — Vercel via GitHub (recommended)

### Step 1: Open in VS Code
1. Open VS Code
2. File → Open Folder → select this folder
3. Install the **Live Server** extension (ritwickdey.LiveServer) for local preview
4. Right-click `index.html` → **Open with Live Server** to test locally

### Step 2: Push to GitHub
```bash
git init
git add index.html vercel.json .gitignore
git commit -m "Initial commit: Workday AI Readiness Assessment"

# Create a repo on github.com first, then:
git remote add origin https://github.com/YOUR-ORG/workday-ai-assessment.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework Preset: **Other** (no framework, it's pure HTML)
4. Root Directory: leave as `/`
5. Click **Deploy**

Vercel will auto-deploy on every push to `main`. You'll get a URL like:
`https://workday-ai-assessment.vercel.app`

---

## Option B — Vercel CLI (fastest, no GitHub needed)

### Prerequisites
```bash
npm install -g vercel
```

### Deploy
```bash
cd /path/to/this/folder
vercel
```

Follow the prompts (link to your Vercel account, accept defaults). Done — you'll get a live URL immediately.

To promote to production:
```bash
vercel --prod
```

---

## Option C — Vercel drag-and-drop (no CLI, no GitHub)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag this folder onto the page
3. Done — live URL in ~30 seconds

---

## VS Code extensions recommended

| Extension | ID | Purpose |
|---|---|---|
| Live Server | ritwickdey.LiveServer | Local preview with hot reload |
| Prettier | esbenp.prettier-vscode | HTML formatting |
| Highlight Matching Tag | vincaslt.highlight-matching-tag | Navigate HTML structure |

---

## Notes for developers

- **No build step** — `index.html` is self-contained. Edit and deploy directly.
- **All data is inline** — DIMS, WD_FEATURES, PAIN_FEATURES, KPI_MAP, PLAYBOOK_MAP are all JS arrays/objects inside the `<script>` tag.
- **Adding questions** — Push a new object to the `DIMS` array following the existing schema. The app auto-renders.
- **Workday-connected mode** — Scaffolded but not yet wired. See the Developer Notes screen (? button in the app header) for the full architecture guide.
- **Branching strategy** — Keep `main` as the stable/demo branch. Use `feature/*` branches for new development.

---

## Environment variables (future)

When the Workday-connected mode is built, you will need:

```
WORKDAY_BASE_URL=https://wd3.myworkday.com/yourorg
WORKDAY_CLIENT_ID=...
WORKDAY_CLIENT_SECRET=...
```

These should be added as **Vercel Environment Variables** (not committed to git).
