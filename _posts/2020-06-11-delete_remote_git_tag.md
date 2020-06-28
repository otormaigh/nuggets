---
layout: post
title: Delete remote Git tag
date: 2020-06-11
tags:
  - git
---

You just need to push an 'empty' reference to the remote tag name and then delete your local copy too:

`git push origin :refs/tags/tagname && git tag --delete tagname`
