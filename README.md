# theSkoop <!-- omit in toc -->

[![Web Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/web-ci.yaml)
[![Mobile Client CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/mobile-ci.yaml)

[![API CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/api-ci.yaml)
[![Cron CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/cron-ci.yaml)
[![Worker CI](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/theskoop/actions/workflows/worker-ci.yaml)

theSkoop is the model for a fully automated user content-driven podcast and news outlet pipeline that is powered by ChatGPT!

Dev/Staging: [https://dev.theskoop.ai](https://dev.theskoop.ai)

Production: [https://theskoop.ai](https://theskoop.ai)

## Table of Contents <!-- omit in toc -->

- [Roadmap](#roadmap)
  - [v1.0.0 - MVP and POC](#v100---mvp-and-poc)
  - [v1.1.0 - User Accounts](#v110---user-accounts)
  - [v1.2.0 - Interactions](#v120---interactions)
  - [v1.3.0 - Notifications/Newletters](#v130---notificationsnewletters)
  - [v1.4.0 - Mobile App](#v140---mobile-app)
  - [v1.4.1 - First Real (Beta) Release](#v141---first-real-beta-release)
  - [v1.5.0 - Advanced Interactions](#v150---advanced-interactions)
  - [v1.6.0 - Advanced Notifications](#v160---advanced-notifications)
  - [v2.0.0 - Enhanced Discover Page](#v200---enhanced-discover-page)
  - [v2.1.0 - Cross-Comparative Article Generation](#v210---cross-comparative-article-generation)
  - [v2.1.0 - Shit is getting realllllll](#v210---shit-is-getting-realllllll)
  - [v3.0.0 - Who the f\*\*k knew we would make it this far?!](#v300---who-the-fk-knew-we-would-make-it-this-far)
- [Develoment - Getting Started](#develoment---getting-started)
  - [Web Client](#web-client)
  - [Server API](#server-api)
  - [Server Cron](#server-cron)
  - [Server Worker](#server-worker)
- [Contribution](#contribution)

## Roadmap

### v1.0.0 - MVP and POC

- [x] Automated summarization of news articles in various consumption lengths
- [x] Basic MVP of web and mobile UI that can fetch results and view different length summaries
- [x] Add newsletter on web app for users to receive email progress updates

### v1.1.0 - User Accounts

- [x] User account registration
- [x] Third-party login support
- [x] Access token based login
- [x] Role-Based Access Control (RBAC)
- [x] Remove dependency on redis
- [x] Refactor to static web pages with Next.js for SEO
- [ ] Improve pipelines/webscraping backend article generation (not noticeable other than fewer garbage articles that say "Okay, I'll try to be better" or something)

### v1.2.0 - Interactions

- [x] Add support for interactions (v1) such as upvotes and downvotes (backend)
- [x] upvote/downvote interactions front ent support
- [ ] Add support for users to provide feedback about articles
- [ ] Add support for users to flag articles as false, low-quality, etc.
- [ ] Bounty/training/feedback program will play an important role in the loyalty and beta test programs

### v1.3.0 - Notifications/Newletters

- [ ] Email notifications
- [ ] Daily (eventually customizable) newsletters with headlines
- [ ] Subscription to topics, threads, and/or keywords
- [ ] Advanced search/filters

### v1.4.0 - Mobile App

- [x] MVP Project and POC
- [ ] Onboarding carousel for mobile app
- [ ] Onboarding guide for web app
- [ ] Basic settings/preferences
- [ ] Interactions
- [ ] Profile page
- [ ] Activity history
- [ ] Minor UI touch ups
- [ ] Metrics gathering (you won't notice this other than a popup asking if you'd like to opt out)

### v1.4.1 - First Real (Beta) Release

- [ ] First release to the app stores
- [ ] Launch of referral and pre-loyalty programs

### v1.5.0 - Advanced Interactions

- [ ] Adding of comments and messaging support (hopefully will not be a heavy lift as moderation could be outsourced to ChatGPT)
- [ ] Adding of following users/friends (see the news articles your friends interact with in realtime)

### v1.6.0 - Advanced Notifications

- [ ] Push notifications with Firebase
- [ ] Text notifications
- [ ] 2-factor authentication with text and/or authenticator applications

### v2.0.0 - Enhanced Discover Page

- [ ] Conversion of Discover page to match the trending style of "Following" and "For You" in the example of social media apps like Instagram and TikTok

### v2.1.0 - Cross-Comparative Article Generation

- [ ] Cross-comparative comprehensive article generation that accounts for multiple sources writing about the same topic
- [ ] Launch of Tier 1 premium membership program
- [ ] Adding of In-App subscriptions for premium members and content
- [ ] Launching of loyalty and referral program

### v2.1.0 - Shit is getting realllllll

- [ ] On-demand cross comparative summaries of articles by registered users (up to a free credit limit per month)
- [ ] Audio options for listening to sources and articles using text-to-speech

### v3.0.0 - Who the f\*\*k knew we would make it this far?!

- [ ] Launch of Tier 2 premium membership program
- [ ] News coverage search and metrics for Tier 2 membership

## Develoment - Getting Started

First run the interactive setup script written by chatgpt!

```bash
theskoop $ ./setup.sh
```

### Web Client

[See the README](src/web/README.md)

```bash
theskoop $ skoop web --local
```

### Server API

[See the README](src/server/README.md)

```bash
theskoop $ skoop api --local
```

### Server Cron

[See the README](src/server/README.md)

```bash
theskoop $ skoop cron --local
```

### Server Worker

[See the README](src/server/README.md)

```bash
theskoop $ skoop worker --local
```

## Contribution

To make a contribution, simply make a new PR onto the `dev` branch. I will automatically be tagged for review and once I approve you're free to merge it!
