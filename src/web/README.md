# TheSkoop Web Application Client

[![Web Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml)

This is the web application for the TheSkoop project

## Getting Started - TL;DR Style (aka Docker)

If you want to skip the workspace setup process, you can run the local docker image via docker compose (hot reloads will be slightly slower than using `pnpm dev`):

```bash
theskoop $ cat src/web/.env-example > src/web/.env
theskoop $ ./compose.sh web --local
```
