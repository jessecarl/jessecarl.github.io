---
layout: post
title: Finishing the go-pubsub Package
date: 2013-10-04 09:00:00
img: /img/posts/go-pubsub.jpg
exerpt: "Actually finishing something is important. It often occurs that a person is either a starter or a finisher. If you are a starter, you pop from one project to the next, spitting out big ideas and often pushing through key proof-of-concept implementations. Then you see something else that needs your brilliant touch, and the project you just started is left incomplete – a testimony to your inability to finish what you start. I don't understand finishers, as I'm not one of them, and while it seems a good idea to provide for them what I provided for starters, like myself, I have new things to talk about."
---

Actually finishing something is important. It often occurs that a person is
either a starter or a finisher. If you are a starter, you pop from one project
to the next, spitting out big ideas and often pushing through key proof-of-concept
implementations. Then you see something else that needs your brilliant touch, and
the project you just started is left incomplete – a testimony to your inability to
finish what you start. I don't understand finishers, as I'm not one of them, and
while it seems a good idea to provide for them what I provided for starters, like
myself, I have new things to talk about.

I have a great number of incomplete projects, and even more I never even got
around to starting. I don't have many finished projects. With that in mind,
I have decided to put some effort into finishing some smallish project that
will not only be a useful tool, but also demonstrate my abilities, and show
that I can actually finish something.

I had two small projects that came to mind to work on. The first is
[fakeapi](https://github.com/lazyengineering/fakeapi), a set of tools to
make automated testing of third-party APIs easier. The basic concept is to
provide an http client that will provide recorded or constructed responses.
It would allow offline testing, buffer against issues with the third-party,
allow testing of edge-cases, and all without increasing the complexity of
the code being tested. It's a project I do need to get back to at some point.

<div class="thumbnail">
  <img src="/img/posts/go-pubsub.jpg" alt="go-pubsub" />
</div>

The other project is [go-pubsub](https://github.com/jessecarl/go-pubsub), a
simple package that sets up the core functionality of a message dispatch
system. I was frustrated that notifications from all of the services I use
(ticket systems, source control, error logs, emails, etc.) all came in vastly
different formats and often required active polling on my part for new
information. It also occurred to me that I probably want these messages in
a different format than my coworkers might. I decided to tackle this problem
by building a service to route messages from publishers (the entities
generating information) to subscribers (the entities consuming information)
over multiplexed channels in go. This makes a perfect project for exploring
concurrency in go to meet a real perceived need in my life.
