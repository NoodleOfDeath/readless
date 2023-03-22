# theSkoop

[![Web Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml)
[![Mobile Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml)

[![API CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml)
[![Cron CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml)
[![Worker CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml)

theSkoop is the model for a fully automated user content-driven podcast and news outlet pipeline that is powered by ChatGPT!

Dev/Staging: [https://dev.theskoop.ai](https://dev.theskoop.ai)

Production: [https://theskoop.ai](https://theskoop.ai)

## Roadmap

### v1.0.0 (MVP and POC)

- [x] Automated summarization of news articles in various consumption lengths
- [x] Basic MVP of web and mobile UI that can fetch results and view different length summaries
- [x] Add newsletter on web app for users to receive email progress updates

### v1.1.0 (User Accounts)

- [x] User account registration/login + third-party login support
- [ ] Improved pipelines/webscraping backend article generation (not noticeable other than fewer garbage articles that say "Okay, I'll try to be better" or something)

### v1.2.0 (Interactions)

- [ ] Add support for interactions such as likes, dislikes, shares, reposts, and following other users
- [ ] Add support for users to provide feedback about articles
- [ ] Add support for users to flag articles as false, low-quality, etc.
- [ ] Bounty/training/feedback program will play an important role in the loyalty and beta test programs

### v1.3.0 (Notifications/Newletters)

- [ ] Email notifications
- [ ] Daily (eventually customizable) newsletters with headlines

### v1.4.0 (Mobile App)

- [ ] Onboarding carousel for mobile app
- [ ] Onboarding guide for web app
- [ ] Basic settings/preferences
- [ ] Interactions
- [ ] Profile page
- [ ] Activity history
- [ ] Minor UI touch ups
- [ ] Metrics gathering (you won't notice this other than a popup asking if you'd like to opt out)

### v1.4.1

- [ ] First release to the app stores
- [ ] Launch of referral and pre-loyalty programs

### v1.5.0

- [ ] Adding of comments and messaging support (hopefully will not be a heavy lift as moderation could be outsourced to ChatGPT)
- [ ] Push notifications with Firebase

### v1.6.0

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

First add the `bin` directory to your executable `PATH`:

```bash
theskoop $ export PATH=\$PATH:~/git/noodleofdeath/theskoop/bin
```

### Web Client

[See the README](src/web/README.md)

```bash
theskoop $ cat src/web/.env-example > src/web/.env
theskoop $ compose web --local
```

### Server API

[See the README](src/server/README.md)

```bash
theskoop $ cat src/server/.env-example > src/server/.env
theskoop $ compose api --local
```

### Server Cron

[See the README](src/server/README.md)

```bash
theskoop $ cat src/server/.env-example > src/server/.env
theskoop $ compose cron --local
```

### Server Worker

[See the README](src/server/README.md)

```bash
theskoop $ cat src/server/.env-example > src/server/.env
theskoop $ compose worker --local
```

## Contribution

To make a contribution, simply make a new PR onto the `dev` branch. I will automatically be tagged for review and once I approve you're free to merge it!
