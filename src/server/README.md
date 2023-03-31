# TheSkoop Backend

[![API CI](https://github.com/NoodleOfDeath/readless/actions/workflows/api-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/api-ci.yaml)
[![Cron CI](https://github.com/NoodleOfDeath/readless/actions/workflows/cron-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/cron-ci.yaml)
[![Worker CI](https://github.com/NoodleOfDeath/readless/actions/workflows/worker-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/worker-ci.yaml)

This is the backend API, CronJob manager (responsible for periodically seeking and queuing jobs) and Worker containers (responsible for processing jobs) for the TheSkoop project

## Getting Started - TL;DR Style (aka Docker)

If you want to skip the workspace setup process, you can run the local docker image via docker compose (hot reloads will be slightly slower than using `yarn dev`):

```bash
src/server $ cat .env-example > .env
src/server $ docker compose up api-local
src/server $ docker compose up cron-local
src/server $ docker compose up worker-local
```

## Getting Started (Workspace Setup - Recommended for Development)

First make sure you already have NPM and PNPM installed.

```bash
npm i -g yarn
```

This project also is fully ESM so make sure your node version is >= 18.

```bash
~ $ git clone git@github.com:NoodleOfDeath/readless.git
~ $ cd readless/src/server
src/server $ yarn install
src/server $ cat .env-example > .env
src/server $ yarn dev:api
src/server $ yarn dev:cron
src/server $ yarn dev:worker
```

## Contribution

When making a PR please name your branch something like `<your-initials>/feat/server/feature-name` or `<your-initials>/fix/server/fix-name` then request my review!
