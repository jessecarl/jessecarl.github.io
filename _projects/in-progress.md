---
title: In Progress
category: in-progress
services:
  - consulting
  - saas
  - debugging
images:
  - src: downtown-building.jpg
    alt: Downtown Tucson
links:
  - https://github.com/jessecarl/resume
  - https://github.com/lazyengineering/faststatus
---

There are currently two small projects in progress: simple tools that
address problems I have experienced recently, and anticipate experiencing again
in the future.<!--more-->

### [Résumé Update Tool](https://github.com/jessecarl/resume)

As I’ve transitioned from being a touring musician back into the world of
software, I’ve come to a new understanding of the importance of continuing to
entertain new opportunities. In the last seven years, since getting that first
post-college job, I put aside my résumé and my interview shoes. I had zero
intention of leaving my job for the first couple of years because I didn’t want
to be *that* millennial. Even after the first couple of years, when I was
starting to feel the itch to leave, I didn’t want to jeopardize my involvement
with my band. Then I went on the road with the band, and with even remote work
an impossibility, I continued to neglect my résumé.

So, when I went to update my résumé, realized I had to update several versions
with the same information, and found myself with some time to build things, I
built a simple tool for keeping my résumé updated. It is a simple command line
tool that I have written about in a blog series here.

### [Fast Status](https://github.com/lazyengineering/faststatus)

Based on a passage from the very important book, [Peopleware](http://www.amazon.com/Peopleware-Productive-Projects-Teams-Second/dp/0932633439),
where engineers asked to track interruptions began to display red flags at
their desks to let people know when they were deep in a task, I decided to
build a digital version of that little red flag. This idea has been rolling
around in my head for years, but I now have the opportunity to build it.

At the core of the project is a simple data structure to represent a resource
that can have a status. The status can have one of three values of ascending
uninterruptibility: Free, Busy, and Occupied. By making the data structure as
simple as possible, the tool itself becomes more useful and versatile. You can
check the status of a coworker (the original inspiration), or you could set the
status of the office bathroom, copy machine, or microwave oven. You could even
use this data structure in managing and monitoring your infrastructure. The
choice to make any applications independent of the core data structure,
including a service for storing and updating status, was an extension of this
impulse to expand utility through simplicity.

