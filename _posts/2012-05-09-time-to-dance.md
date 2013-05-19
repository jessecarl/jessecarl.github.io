---
layout: post
title: Time to Dance
date: 2012-05-09 21:42:00
exerpt: "I&#8217;ll start by acknowledging  the fact that it has been *too long* since I have updated this blog. I got bored and had no collaborators for the [pyFidelity](/pyFidelity/) project, so I stopped."
---

I&#8217;ll start by acknowledging  the fact that it has been *too long* since I
have updated this blog. I got bored and had no collaborators for the
[pyFidelity](/pyFidelity/) project, so I stopped.

I now have a new project to work on (this time with collaboration). I will not
go into too much detail about the project but to say that it can be modeled as
an [exact cover](http://en.wikipedia.org/wiki/Exact_cover) problem; a set of
constraints and a set of partial solutions. For any given constraint, all of the
partial solutions are mutually exclusive. The best example of such a problem is
a sudoku puzzle. I do not want to spend too much time explaining the problem, so
I&#8217;ll move on.

I have been enjoying the [Go](http://golang.org) programming language lately, so
I want to see if the [Dancing Links](http://en.wikipedia.org/wiki/Dancing_Links)
implementation of [Knuth&#8217;s Algorithm X](http://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X)
described best in [his paper \[gzipped postscript\]](http://www-cs-faculty.stanford.edu/~uno/papers/dancing-color.ps.gz)
can be done nicely in go. Not to avoid due diligence, I conducted a quick search
of the go resources and mailing list as well as github repositories. I found
only a [sudoku solver](https://github.com/soniakeys/dlx-sudoku) which roughly
implements DLX and several implementations in other languages. So, I started
[my own](https://github.com/jessecarl/goDLX) project.

As time goes on, I hope to keep this blog updated with the development of this
project.

