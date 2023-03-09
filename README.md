# TheSkoop

[![Web Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml)
[![Mobile Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml)

[![API CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml)
[![Cron CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml)
[![Worker CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml)

TheSkoop is the model for a fully automated user content-driven podcast and news outlet pipeline that is powered by ChatGPT!

Dev/Staging: [https://dev.theskoop.ai](https://dev.theskoop.ai)

Production: [https://theskoop.ai](https://theskoop.ai)

## Getting Started

### Web Client

[See the README](src/web/README.md)

```bash
theskoop $ cat src/web/.env-example > src/web/.env
theskoop $ ./compose.sh web --local
```

### Server API

[See the README](src/server/README.md)

```bash
theskoop $ cat src/server/.env-example > src/server/.env
theskoop $ ./compose.sh api --local
```

### Server Cron

[See the README](src/server/README.md)

```bash
theskoop $ cat src/server/.env-example > src/server/.env
theskoop $ ./compose.sh cron --local
```

### Server Worker

[See the README](src/server/README.md)

```bash
theskoop $ cat src/server/.env-example > src/server/.env
theskoop $ ./compose.sh worker --local
```

## Contribution

To make a contribution, simply make a new PR onto the `dev` branch. I will automatically be tagged for review and once I approve you're free to merge it!
