---
title: Delete remote Git tag
tags:
  - git
emoji: 💾
link: https://git-scm.com/
---

You just need to push an 'empty' reference to the remote tag name and then delete your local copy too:

`git push origin :refs/tags/tagname && git tag --delete tagname`
