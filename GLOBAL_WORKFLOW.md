# Netlify CLI Deployment Workflow

## Purpose
This repo is configured to avoid Netlify CI build credits. All deploys are performed locally via Netlify CLI.

## Quick Commands
- Draft (public preview, free):  
  ```sh
  npm run preview
  ```

- Production (live deploy):
  ```sh
  npm run publish
  ```

### Requirements
* OS env must have `NETLIFY_AUTH_TOKEN` (no interactive login).
* Must set `NETLIFY_SITE_ID` in `.env.local`.

## Branch / PR Rules
* Do not push directly to `main`.
* Use feature branches (`feat/<slug>`) and open PRs.
* Deploys do **not** depend on CI. Draft/Prod is via CLI only.

## Tools (Agents & MCP)
* For browsing: **Browserbase** MCP.
* For docs: **docs-mcp-server** MCP.
* Prefer these tools when research is needed; paste doc URLs used into PRs.

## Why Draft Deploys
* Draft deploys upload a local build; they are public and support Netlify Forms / Functions.
* They **do not** use Netlify CI minutes or per-push credits.
* Production deploy is a deliberate one-liner when changes are approved.

## Site Linking (one-time)
* In Netlify UI, copy the Site ID for this site.
* Put it in `.env.local` as:
  ```
  NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  ```
* That's it; agents can deploy non-interactively.
