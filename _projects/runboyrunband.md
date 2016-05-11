---
title: Run Boy Run Band Website
category: runboyrunband
services:
  - consulting
  - saas
images:
  - src: runboyrun.jpg
    alt: Run Boy Run
    animated: runboyrun.gif
links:
  - http://www.runboyrunband.com
  - https://github.com/jessecarl/www.runboyrunband.com/
---

I built this application for the band that was my primary occupation for a few
years. Because I had near-total freedom, the Run Boy Run website became a
testbed for my approach to web development.<!--more-->

I built the site in [Go](http://golang.org), deployed to
[Heroku](http://heroku.com), organized content according to volatility,
structured data to match the content, and curated content according to the
explicit goals of the band. The site is built on top of my open source
[gobase](http://github.com/lazyengineering/gobase) project. I have released
the source for the whole site, but I am in the process now of porting all the
band-specific components to another open source project.

Looking back at the code recently, a few things stand out as bad practices. I
may take some time to post about these flaws in the design at a later date.
