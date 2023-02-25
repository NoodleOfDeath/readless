# TheSkoop API

This is the backend API for the TheSkoop project

## Getting Started - TL;DR Style (aka Docker)

If you want to skip the workspace setup process, you can run the local docker image via docker compose (hot reloads will be slightly slower than using `pnpm run dev`):

```bash
src/server $ docker compose up
```

## Getting Started (Workspace Setup - Recommended for Development)

First make sure you already have NPM and PNPM installed.

```bash
npm i -g pnpm
```

This project also is fully ESM so make sure your node version is >= 18.

```bash
git clone git@github.com:NoodleOfDeath/theskoop.git
cd theskoop/src/server
pnpm install
echo PORT=6970 > .env
pnpm run dev
```

## Contribution

When making a PR please name your branch something like `/feat/server/feature-name` or `/fix/server/fix-name` then request my review!
