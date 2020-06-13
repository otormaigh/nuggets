---
title: Git
tags:
  - git
emoji: 💾
link: https://git-scm.com/
---

#### Set local name and email
This can either be globally or just for a single project. Add or omit the `--global` flag depending on which its for.
* Name:  `git --config --global user.name "First Last"`
* Email: `git --config --global user.email "e@mail.ie"`

#### Delete a remote tag
You just need to push an 'empty' reference to the remote tag name and then delete your local copy too:

`git push origin :refs/tags/tagname && git tag --delete tagname`
