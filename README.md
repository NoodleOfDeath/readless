# TheSkoop

[![Web Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml)
[![Mobile Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml)

[![API CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml)
[![Cron CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml)
[![Worker CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml)

TheSkoop is the model for a fully automated user content-driven podcast and news outlet pipeline that is powered by ChatGPT!

Dev/Staging: [https://dev.theskoop.ai](https://dev.theskoop.ai)

Production: [https://theskoop.ai](https://theskoop.ai)

## Roadmap

Welcome Alpha Testers!

This is first raw POC (proof of concept) I throw together in 2 weeks (website, backend, and automated cloud deployment included). The mobile app is a major WIP but you should be able to at least read the news and refresh the discover page. Lots more to come!

Release Roadmap:

### v1.0.0

- [x] Automated summarization of news articles in various consumption lengths
- [x] Basic MVP of web and mobile UI that can fetch results and view different length summaries
- [ ] Add newsletter on web app for users to receive email progress updates

### v1.1.0

- [ ] Onboarding carousel
- [ ] Basic settings/preferences
- [ ] Minor UI touch ups
- [ ] Metrics gathering (you won't notice this other than a popup asking if you'd like to opt out)

### v1.2.0

- [ ] User account registration/login
- [ ] Improved pipelines/webscraping backend article generation (not noticeable other than fewer garbage articles that say "Okay, I'll try to be better" or something)

### v1.3.0

- [ ] Add support for interactions such as likes, dislikes, shares, reposts, and following other users

### v1.3.1

- [ ] First release to the app stores
- [ ] Launch of referral and pre-loyalty programs

### v1.4.0 

- [ ] Adding of comments and messaging support (hopefully will not be a heavy lift as moderation could be outsourced to ChatGPT)

### v1.5.0

- [ ] Conversion of Discover page to match the trending style of "Following" and "For You" in the example of social media apps like Instagram and TikTok

### v2.0.0

- [ ] Cross-comparative comprehensive article generation that accounts for multiple sources writing about the same topic
- [ ] Launch of Tier 1 premium membership program
- [ ] Adding of In-App subscriptions for premium members and content
- [ ] Launching of loyalty and referral program

### v2.1.0

- [ ] On-demand cross comparative summaries of articles by registered users (up to a free credit limit per month)

### v3.0.0

- [ ] Launch of Tier 2 premium membership program
- [ ] News coverage search and metrics for Tier 2 membership

## Develoment - Getting Started

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
