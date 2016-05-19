---
layout: post
title: Introducing Fast Status
category:
  - saas
  - toolbuilding
---

There is a book that every creative professional or manager of creative
professionals must read: *[Peopleware](http://www.amazon.com/Peopleware-Productive-Projects-Teams-Second/dp/0932633439)*.
DeMarco and Lister make a strong case for people being more important than
process or technology. In Chapter 10, Brain Time and Body Time, the authors
recounted an experience with a client company where they began to measure
uninterrupted work time. At some point, the engineers began to display red
bandannas on their desks to indicate that now might not be a good time to
interrupt their work. [Fast Status](https://github.com/lazyengineering/faststatus)
is like a digital red bandanna.<!--more-->

Probably the second or third time I read that chapter, I was working in a very
typical environment for the modern creative coworker. I had a desk, one or two
flimsy walls, and a tiny separator from the desk next to mine. The room was
loud, or at least full of important conversations that needed to happen, but
not for the work I was doing. While the noise was an issue, the convenience of
my desk for coworkers who had questions for me was probably a bigger problem.
I was always glad to help out coworkers, and I’ve been known to like to talk,
but I also had work to do. When you combine this physical work environment with
the digital work environment of today, interruptions never stop, and unlike in a
software company in the 1980’s, a red bandanna will not cut it.

That was when I first started thinking about some kind of system for widely
broadcasting your busy status. I’ve thought through a good number of ideas for
how it could work, and I’ve probably made excited pitches to every person I
know. The most common objections to the project are that it is too simple, and
that people will likely abuse or ignore any busy status. Both are probably
right, but also missing some key ideas.

### Oversimple as an Asset

The idea of a service or system that only communicates a binary (or trinary)
status seems superfluous. Practically every device and application has some
way of setting a do-not-disturb status or the equivalent. Surely, we don’t
need yet it if we can already set our phones, chat apps, and computers to
busy. But, isn’t that exactly *why* we need some way of coordinating this
information? If we make the most simple tool possible – not even a tool, just
a common data structure to pass around – we can possibly integrate with each
of these other applications and devices with ease.

And if it is as simple as I suggest, it could be used for more than just
people who do not want to be disturbed. What if the office bathroom could tell
you it is occupied? The microwave? A server? Any resource that can be free, busy
or occupied should be able to communicate status in a simple, predictable,
portable manner.

### Automation and Social Convention

What about the people who set themselves as busy, and never set themselves as
free? Whether by accident, or on purpose, it is bound to happen. Well, that’s
on them. Like any other social convention, it depends on the people more than
the technology to work. Additionally, the fact that this tool is only the data
itself makes the use of the tool totally up to the user, not the toolmaker.

Additionally, this simplicity would allow for user interfaces that are
transparent, or nearly so. A worker could put a box with three light-up
buttons that make changing status a single motion. A sensor could be placed
in a bathroom lock to detect when the door is closed, sending appropriate
status out from there. Automation and integration will make this a tool that
actually gets used appropriately.

----

I’m very excited to get work done on this project. I’ve already begun by
implementing the basic data structures, and their transformation to and from
both single-line text and JSON. Work on a simple microservice to update and
store status is on the way next.
