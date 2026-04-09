# Contributor budget UI (prototype)

Interactive preview for **shared daily project time** states on the Outlier-style timesheet: running session, reminders, claim blocked, frozen timer, and return visit. Includes a collapsible **design context** section for stakeholder review.

Stack: **React**, **TypeScript**, **Vite**, **Tailwind CSS v4**.

## Live preview (after GitHub Pages deploy)

If **GitHub Actions → Pages** is enabled for this repo, the latest `main` build is published at:

**https://wnelgynel.github.io/Hubstaff-V2/**

In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow `.github/workflows/deploy-pages.yml` runs on every push to `main`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. `http://127.0.0.1:5173/`).

## Build

```bash
npm run build
```

## Publish to GitHub

If this folder is already a git repo with commits, authenticate and create the remote repository:

```bash
gh auth login
cd /path/to/contributor-budget-ui
gh repo create contributor-budget-ui --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` for a private repository. To use a different name, change `contributor-budget-ui` in the command.

**Without GitHub CLI:** create an empty repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```
