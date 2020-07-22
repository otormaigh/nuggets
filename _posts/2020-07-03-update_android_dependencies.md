---
layout: post
title: Update Android dependencies
date: 2020-07-03
tags:
  - android
  - laziness
---

Over the life of a project, one of the most easily avoidable show-stoppers is being stuck with a specific dependency version because updating it any further will unleash an unimaginable wrath upon your project in the form of a breaking API or worse, it might introduce something [hidden](https://github.com/otormaigh/blank-android/pull/270) that you wouldn't even think to test for. Breaking changes are inevitable, that's the nature of the business that we are in, but that's not a valid excuse for staleness and is most definitely not the kind of lazy we want to be. With a little bit of the good kind of laziness pointed in the right direction, keeping those dependencies up-to date will be a dawdle.

This is a two stage process, you need to first be notified about a dependency update and secondly you need to validate that that update won't break anything in you app and effect your end users.

[Dependabot](https://dependabot.com/) is a great service for the notification part. It'll auto create a PR per dependency update, so that each change can be tested in isolation. Some config options are, to have it on a daily/weekly/monthly cronjob, set it to auto-label a PR and tell it to use a specific target branch to fork off (see the docs on their website for some better information, or have a nosey through their [GitHub repo](https://github.com/dependabot/dependabot-core)). The downside is that it was originally built to work with GitHub, so for best support it should be used with GitHub repos (it does appear to work with GitLab, but I can't confirm). Also, it can be quite opinionated when it comes to reading the dependency list in your project, you can either keep them in a vanilla `dependencies` block within the `app/build.gradle` or you can extract them out to a `dependencies.gradle` file. It doesn't support `buildSrc` Kotlin files (keep an eye on [this](https://github.com/dependabot/dependabot-core/issues/2180) issue though, that might change).

Verification is more generic, there are no requirements here, so as long as you already have some CI setup (shame on you if you don't) it'll work just fine. Once Dependabot opens a PR, you can have your CI run any checks to test and validate the update. What you do with that information is entirely yours to waste now, but at least you will have solid and early evidence on what dependencies can and can't be updated at the moment and be better able to schedule any work needed due to breaking changes.

Since Dependabot has native GitHub Actions support, to enable it on your GitHub project all you need to do is add the following (NOTE: this adds a `automerge` label and will set the target branch to `chore/dependency-update`, edit or delete those as you see fit):

```
----------------------
.github/dependabot.yml
----------------------

version: 2
updates:
- package-ecosystem: gradle
  directory: "/"
  schedule:
    interval: daily
  open-pull-requests-limit: 99
  target-branch: chore/dependency-update
  labels:
  - automerge
```

Push that change to you main (or if specified, target) branch and watch those PR's fly in.
