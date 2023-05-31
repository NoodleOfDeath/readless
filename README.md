# Read Less <!-- omit in toc -->

[![Web Client CI](https://github.com/NoodleOfDeath/readless/actions/workflows/web-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/web-ci.yaml)
[![Mobile Client CI](https://github.com/NoodleOfDeath/readless/actions/workflows/mobile-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/mobile-ci.yaml)

[![API CI](https://github.com/NoodleOfDeath/readless/actions/workflows/api-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/api-ci.yaml)
[![Cron CI](https://github.com/NoodleOfDeath/readless/actions/workflows/cron-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/cron-ci.yaml)
[![Worker CI](https://github.com/NoodleOfDeath/readless/actions/workflows/worker-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/worker-ci.yaml)

Read Less is the model for a fully automated news aggregation pipeline that is powered by generative AI!

- Dev/Staging (web): [https://dev.readless.ai](https://dev.readless.ai)
  - user: `dev`, pass: `dev`
- Production (web): [https://readless.ai](https://readless.ai)
- Production (ios): [https://apps.apple.com/us/app/read-less-news/id6447275859](https://apps.apple.com/us/app/read-less-news/id6447275859)
- Production (android): [https://play.google.com/store/apps/details?id=ai.readless.ReadLess](https://play.google.com/store/apps/details?id=ai.readless.ReadLess)

## Table of Contents <!-- omit in toc -->

- [Roadmap](#roadmap)
  - [MVP and POC](#mvp-and-poc)
  - [v1.0 - Mobile App](#v10---mobile-app)
  - [v1.1 - Watch Support and Sorting](#v11---watch-support-and-sorting)
  - [v1.2 - Text-to-Speech](#v12---text-to-speech)
  - [v1.3 - AI Generated Images + Sentiment Analysis](#v13---ai-generated-images--sentiment-analysis)
  - [v1.4/v1.5 - iPad Support + Smart Search](#v14v15---ipad-support--smart-search)
  - [v1.6 - Smart Seach + AFINN/VADER Sentiment Analysis](#v16---smart-seach--afinnvader-sentiment-analysis)
  - [v1.7 - Localization](#v17---localization)
  - [v1.8 - Duplicate Article Detection](#v18---duplicate-article-detection)
  - [v1.9 - AI Voice Cloning + Tier 1 Subscriptions](#v19---ai-voice-cloning--tier-1-subscriptions)
  - [v1.10 - Notifications/Newletters](#v110---notificationsnewletters)
  - [v1.11 - Advanced Notifications](#v111---advanced-notifications)
  - [v1.12 - On Demand Sentiment Pipeline](#v112---on-demand-sentiment-pipeline)
  - [v17.0 - Enhanced Discover Page](#v170---enhanced-discover-page)
  - [v17.1 - Cross-Comparative Article Generation](#v171---cross-comparative-article-generation)
  - [v69.69 - Shit is getting realllllll](#v6969---shit-is-getting-realllllll)
  - [v6724.21 - Who the f\*\*k knew we would make it this far?!](#v672421---who-the-fk-knew-we-would-make-it-this-far)
- [Develoment - Getting Started](#develoment---getting-started)
  - [Web Client](#web-client)
  - [Server API](#server-api)
  - [Server Cron](#server-cron)
  - [Server Worker](#server-worker)
- [Contribution](#contribution)

## Roadmap

### MVP and POC

- [x] Automated summarization of news articles in various consumption lengths
- [x] Basic MVP of web and mobile UI that can fetch results and view different length summaries
- [x] Add newsletter on web app for users to receive email progress updates
- [x] User account registration
- [x] Third-party login support
- [x] Access token based login
- [x] Role-Based Access Control (RBAC)
- [x] Remove dependency on redis
- [x] Refactor to static web pages with Next.js for SEO
- [x] Improve pipelines/webscraping backend article generation (not noticeable other than fewer garbage articles that say "Okay, I'll try to be better" or something)
- [x] Add support for interactions (v1) such as upvotes and downvotes (backend)
- [x] upvote/downvote interactions front ent support
- [x] Record views and reading format
- [x] Add support for users to provide feedback about articles
- [x] Add support for users to flag articles as false, low-quality, etc.
- [x] (I already record the metrics to implement this eventually) Bounty/training/feedback program will play an important role in the loyalty and beta test programs (eventually moderation)

### v1.0 - Mobile App

- [x] MVP Project and POC

### v1.1 - Watch Support and Sorting
- [x] Advanced search/filters
  - [x] By category
  - [x] By outlet
  - [x] By relevance of wildcards
  - [x] By tags
- [x] ~Onboarding guide for mobile app~
- [x] Basic settings/preferences
- [x] Interactions
- [ ] ~Modify Account Page~
- [x] User login/signup
- [x] Activity history
- [x] Minor UI touch ups
- [x] Offline bookmarking
- [x] Categories
- [x] Following of categories on (My Stuff Screen)
- [x] Metrics gathering
- [x] Bookmarking and Favorites
- [x] Sharing of articles
- [x] Display mobile app banner on web app
- [x] Update web app manifests to have graphics
- [ ] ~Adding of comments and messaging support (hopefully will not be a heavy lift as moderation could be outsourced to ChatGPT)~
- [ ] ~Adding of following users/friends (see the news articles your friends interact with in realtime)~

### v1.2 - Text-to-Speech

- [x] Basic text-to-speech

### v1.3 - AI Generated Images + Sentiment Analysis
- [x] AI generated images
- [x] Autoload more articles on scroll
- [x] Compact mode + short summaries
- [x] Sloppy AF OpenAI based sentiment analysis scoring  

### v1.4/v1.5 - iPad Support + Smart Search
- [x] Topic detection in past 24 hours
- [x] iPad support
- [x] Smart search preparations + highlighting

### v1.6 - Smart Seach + AFINN/VADER Sentiment Analysis
- [x] Smart search
- [x] AFINN/VADER Sentiment Analysis 
- [x] Channels 
- [x] Sentiment analysis with every query

### v1.7 - Localization
- [x] Localization for 30+ languages
- [x] On-demand translation of articles
- [x] UI touch ups
- [x] Apple Watch loads pictures
- [x] Performance improvments

### v1.8 - Duplicate Article Detection
- [ ] AI Duplicate Article Detection
- [ ] Onboarding less invasive card stacks

### v1.9 - AI Voice Cloning + Tier 1 Subscriptions
- [ ] On demand AI Voice Cloning

### v1.10 - Notifications/Newletters

- [ ] Email notifications?
- [ ] Daily (eventually customizable) newsletters with headlines?
- [ ] Subscription to topics, threads, and/or keywords?

### v1.11 - Advanced Notifications

- [ ] Push notifications with Firebase
- [ ] Text notifications
- [ ] 2-factor authentication with text and/or authenticator applications

### v1.12 - On Demand Sentiment Pipeline
- [ ] Expose pipeline for users to upload text/documents to be processed

### v17.0 - Enhanced Discover Page

- [ ] Conversion of Discover page to match the trending style of "Following" and "For You" in the example of social media apps like Instagram and TikTok

### v17.1 - Cross-Comparative Article Generation

- [ ] Cross-comparative comprehensive article generation that accounts for multiple sources writing about the same topic
- [ ] Launch of Tier 1 premium membership program
- [ ] Adding of In-App subscriptions for premium members and content
- [ ] Launching of loyalty and referral program

### v69.69 - Shit is getting realllllll

- [ ] On-demand cross comparative summaries of articles by registered users (up to a free credit limit per month)
- [ ] Audio options for listening to sources and articles using text-to-speech

### v6724.21 - Who the f\*\*k knew we would make it this far?!

- [ ] Launch of Tier 2 premium membership program
- [ ] News coverage search and metrics for Tier 2 membership

## Develoment - Getting Started

First run the interactive setup script written by chatgpt!

```bash
readless $ ./setup.sh
```

### Web Client

[See the README](src/web/README.md)

```bash
readless $ rless web --local
```

### Server API

[See the README](src/server/README.md)

```bash
readless $ rless api --local
```

### Server Cron

[See the README](src/server/README.md)

```bash
readless $ rless cron --local
```

### Server Worker

[See the README](src/server/README.md)

```bash
readless $ rless worker --local
```

## Contribution

To make a contribution, simply make a new PR onto the `dev` branch. I will automatically be tagged for review and once I approve you're free to merge it!
