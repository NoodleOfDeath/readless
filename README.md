# Read Less <!-- omit in toc -->

[![License](https://img.shields.io/badge/Proprietary-CLA_License-purple)](https://github.com/NoodleOfDeath/readless/blob/dev/LICENSE)

[![Web Client CI](https://github.com/NoodleOfDeath/readless/actions/workflows/web-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/web-ci.yaml)
[![Mobile Client CI](https://github.com/NoodleOfDeath/readless/actions/workflows/mobile-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/mobile-ci.yaml)
[![API CI](https://github.com/NoodleOfDeath/readless/actions/workflows/api-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/api-ci.yaml)
[![Scheduler CI](https://github.com/NoodleOfDeath/readless/actions/workflows/scheduler-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/scheduler-ci.yaml)
[![Worker CI](https://github.com/NoodleOfDeath/readless/actions/workflows/worker-ci.yaml/badge.svg)](https://github.com/NoodleOfDeath/readless/actions/workflows/worker-ci.yaml)

[![JIRA](https://img.shields.io/badge/JIRA-Read_Less-darkblue
)](https://readless.atlassian.net/jira/software/projects/RL/boards/1)
[![DigitalOcean](https://img.shields.io/badge/DigitalOcean-Read_Less-blue
)](https://cloud.digitalocean.com/projects/ef71d72f-7fef-4646-b64e-a1b5a5153b29/resources?i=2048ee)

[![https://dev.readless.ai](https://img.shields.io/badge/Dev/Staging-Web-white
)](https://dev.readless.ai)
[![https://readless.ai](https://img.shields.io/badge/Production-Web-white)](https://readless.ai)
[![https://apps.apple.com/us/app/read-less-news/id6447275859](https://img.shields.io/badge/Production-iOS-white)](https://apps.apple.com/us/app/read-less-news/id6447275859)
[![https://play.google.com/store/apps/details?id=ai.readless.ReadLess](https://img.shields.io/badge/Production-Android-white)](https://apps.apple.com/us/app/read-less-news/id6447275859)

Read Less is the model for a fully automated news aggregation pipeline that is powered by generative AI!

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
  - [v1.8/v1.9/v1.10 - Duplicate Article Detection](#v18v19v110---duplicate-article-detection)
  - [v1.11 - UI Updates to Match Artifact](#v111---ui-updates-to-match-artifact)
  - [v1.12 - Recaps](#v112---recaps)
  - [v1.13 - Recap Localization](#v113---recap-localization)
  - [v1.14 - Notifications/Newletters](#v114---notificationsnewletters)
  - [v1.15/v1.16 - Home Screen Widget](#v115v116---home-screen-widget)
  - [v1.17 - Bringing Back Accounts](#v117---bringing-back-accounts)
  - [v1.18 - Word Games and Achievements](#v118---word-games-and-achievements)
  - [v1.19 - Local News and On Demand Jobs](#v119---local-news-and-on-demand-jobs)
  - [v27.0 - Enhanced Discover Page](#v270---enhanced-discover-page)
  - [v27.1 - Cross-Comparative Article Generation](#v271---cross-comparative-article-generation)
  - [v69.69 - Shit is getting realllllll](#v6969---shit-is-getting-realllllll)
  - [v6724.21 - Who the f\*\*k knew we would make it this far?!](#v672421---who-the-fk-knew-we-would-make-it-this-far)
- [Development - Getting Started](#development---getting-started)
  - [Web Client](#web-client)
  - [Server API](#server-api)
  - [Server Scheduler](#server-scheduler)
  - [Server Worker](#server-worker)
- [Contribution](#contribution)
- [CLI Cheatsheet](#cli-cheatsheet)
  - [Make a new PR](#make-a-new-pr)
  - [Rebase your Branch](#rebase-your-branch)

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

### v1.8/v1.9/v1.10 - Duplicate Article Detection

- [x] Improve applinks to show OG images
- [x] Improve share dialog
- [x] AI Duplicate Article Detection
- [x] Onboarding less invasive card stacks

### v1.11 - UI Updates to Match Artifact

- [x] Major performance updates
- [x] Press and hold to share
- [x] Suck it meta! Come at me bro! 

### v1.12 - Recaps

- [x] Introduces daily recaps to the mobile app
- [x] Minor UI improvements and bug fixes

### v1.13 - Recap Localization

- [x] Localizes daily recaps on the mobile app
- [x] Major UI performance updates
- [x] Adds context menus in intuitive places
- [x] Moves sentiments to always be shown
- [x] Short hold shows summary previews (iOS only for now)
- [ ] ~Implement ContextMenu native for Android?~
- [x] Improve localization to happen on-demand seamlessly, to appear already translated (will need to revisit for streaming performance)
- [x] Update publishers to fetch original images assigned to @mkdirsteve
- [x] Improve top stories algorithm to prioritize topics covered in past 24 hours over sibling count

### v1.14 - Notifications/Newletters

- [x] App Store artwork makeover
- [ ] ~Add a dislike system for the future "smart" algorithm?~
- [x] Backend subscription plumbing to emails/sms/push notifications (50% done)
- [x] Add subscription flow to mobile UI
- [ ] ~Daily (eventually customizable) newsletters with headlines~
- [ ] ~Subscription to topics, threads, and/or keywords~
- [x] Push notifications with Firebase
- [ ] ~Replace trigger words with actual negative filters~
  
### v1.15/v1.16 - Home Screen Widget

- [x] Home screen widget for iOS
- [x] Home screen widget for Android 
- [ ] ~Add variations to summaries~

### v1.17 - Bringing Back Accounts

- [x] Improve backend plumbing to offload much of the client data onto the backend such as followed preferences?
- [ ] ~2-factor authentication with text and/or authenticator applications~
- [ ] Pros of accounts?
  - [x] Account recovery
  - [x] Offload preferences on backend
  - [x] Backend can employ workers to better provide service
  - [x] Syncing of preferences across devices
  - [ ] ~Do accounts really need emails? Only for recovery?~
  - [ ] ~Could provide user with a private key instead for recovery?~
- [x] Anonynmous accounts
- [x] Streaks
- [ ] Sharing of streaks
- [ ] Notification of lost streaks

### v1.18 - Word Games and Achievements

- [ ] Word games
- [ ] Achievements
- [ ] Leaderboards
- [ ] Sharing of achievements 
- [ ] Server side syncing of user data?

### v1.19 - Local News and On Demand Jobs

- [ ] Provide local news (needs some kind of optimization for scaling)
- [ ] Expose pipeline for users to upload text/documents to be processed
- [ ] Allow users to re-request AI images?
- [ ] Text notifications

### v27.0 - Enhanced Discover Page

- [ ] Conversion of Discover page to match the trending style of "Following" and "For You" in the example of social media apps like Instagram and TikTok
- [ ] Use a "smarter" algorithm to better serve users, or nah?

### v27.1 - Cross-Comparative Article Generation

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

## Development - Getting Started

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

### Server Scheduler

[See the README](src/server/README.md)

```bash
readless $ rless scheduler --local
```

### Server Worker

[See the README](src/server/README.md)

```bash
readless $ rless worker --local
```

## Contribution

To make a contribution, simply make a new PR onto the `dev` branch. I will automatically be tagged for review and once I approve you're free to merge it!

## CLI Cheatsheet

### Make a new PR

It is usually good practice (but not always required) to [rebase your branch](#rebase-your-branch) before you push (line 23 below). Anytime you rebase you will need to use the `--force` glag when pushing. I don't use it below, because it **should not be a regularly used flag**; _only when overwriting rebased code_.

```bash
 1 | # cd into server directory
 2 | cd ~/git/noodleofdeath/readless/src/server
 3 |
 4 | # clear any unstaged changes
 5 | git reset --hard
 6 |
 7 | # checkout the dev branch
 8 | git checkout dev
 9 |
10 | # pull latest changes from dev
11 | git pull --rebase
12 |
13 | # create your new branch with changes
14 | git checkout -b feat/pub-updates
15 |
16 | # stage your file changes
17 | git add .
18 |
19 | # commit your staged changes
20 | git commit -m "feat(sitemaps): adds titties to readless"
21 |
22 | # push your changes to your branch
23 | git push -u origin feat/pub-updates
24 |
25 | # on mac this should open chrome for you to create your PR
26 | open https://github.com/NoodleOfDeath/readless/pulls
27 |
28 | # im curious now. ive never made a PR from CLI
29 | # researching... (6%)... (80%)... (100%)
30 | # oh sickkkk
31 |
32 | # install the hub command
33 | brew install hub
34 |
35 | # show the hub usage
36 | hub --help
37 |
38 | # make pull request after you push (line 23)
39 | hub pull-request
```

### Rebase your Branch

To **rebase** your branch you simply do the following, where `origin/dev` is the branch you want to pull updated code from and merge into your branch.

```bash
git fetch && git rebase origin/dev
```

When your branch is behind the origin branch, rebasing will usually fix the below error. You will never experience this error ever in this project because you will never commit directly to `dev` or `main`.

```bash
thom@mac mobile % git push
To github.com:noodleofdeath/readless.git
 ! [rejected]          dev -> dev (fetch first)
error: failed to push some refs to 'github.com:noodleofdeat
h/readless.git'
hint: Updates were rejected because the remote contains wor
k that you do
hint: not have locally. This is usually caused by another r
epository pushing
hint: to the same ref. You may want to first integrate the 
remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --hel
p' for details.
```

