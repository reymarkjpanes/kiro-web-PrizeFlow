---
inclusion: manual
---

# Deployment Workflow — PrizeFlow

## Platform

Vercel (zero-configuration deployment for Vite projects)

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code; auto-deploys to production |
| `feat/*` | Feature branches; create PR against `main` |
| `fix/*` | Bug fix branches; create PR against `main` |

## Deployment Pipeline

1. Developer pushes to feature branch
2. Vercel creates a preview deployment automatically
3. PR is reviewed and approved
4. PR is merged to `main`
5. Vercel deploys to production automatically

## Pre-Push Checklist

Before pushing any branch:

```bash
npm run build    # Must complete without errors
```

Verify:
- [ ] TypeScript compiles cleanly (no errors)
- [ ] No unused imports or variables
- [ ] Build output is reasonable size
- [ ] No `console.log` statements left in code

## Build Configuration

- **Framework**: Vite (auto-detected by Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 22.x

No `vercel.json` is needed. Vite projects are auto-detected.

## Environment Variables

None required. The application is fully client-side with no secrets.

## Performance Budget

| Asset | Target |
|-------|--------|
| HTML | < 1 KB |
| CSS | < 25 KB (gzipped < 5 KB) |
| JS | < 250 KB (gzipped < 70 KB) |
| Total transfer | < 100 KB gzipped |

## Rollback

If a production deployment has issues:
1. Revert the merge commit on `main`
2. Push the revert — Vercel auto-redeploys
3. Or: use Vercel dashboard to promote a previous deployment
