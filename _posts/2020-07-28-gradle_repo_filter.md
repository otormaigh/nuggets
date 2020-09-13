---
layout: post
title: Gradle Repository Filter
date: 2020-07-28
tags:
  - gradle
---

This come in handy when you need to add an extra repository to a Gradle project to be able to use a new third party dependency. The risk with adding an new external repo to pull in dependencies is that the repo maintainer could include a popular dependency that they have modified to add malicious code. If for some reason the original repo is down when your project tries to download it, it will run down the list of the other repositories that you have defined to see if any of them have a reference to it, which will then cause the malicious version to be downloaded and used.

Invariable, there is a low likelihood that this will happen in the first place and also will happen when generating a release build, but with a little effort we can mitigate this kind of attack by adding an explicit filter to repo block to make sure it looks for an exact module/group or to exclude a module/group that you know should never be pulled from that source.

Let's say you have a dependency that's being hosted on Jitpack

```
maven {
  url "https://jitpack.io"
  content {
    includeModule("com.github.User", "Repo")
  }
}
```
