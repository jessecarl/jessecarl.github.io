---
layout: "post"
title: "Portfolio Image Pipelines"
date: "2016-05-27 20:54:00"
category:
  - saas
  - toolbuilding
img: /img/posts/drop-the-needle-md.jpg
---

This week has been focused on porting my old personal website from
[Jekyll](https://jekyllrb.com/) to [Hugo](https://gohugo.io/). I was hoping
there would be good fodder for a blog post in that, but it turns out that
the conversion is pretty boring. Hugo is a lot like what Jekyll is slowly
trying to become. There are a few things that I miss from Jekyll, like the
asset pipeline, but that always felt a little bit tacked on. There are a lot
of things in Jekyll that feel tacked on (I write on this blog powered by
Jekyll).<!--more-->

<figure class="thumbnail">
  <img src="/img/posts/drop-the-needle-md.jpg" alt="Drop the Needle">
  <figcaption>
    <h4>Drop the Needle <small>35mm Ilford HP5+ B&amp;W Film</small></h4>
    <p>One of the photos featured in my portfolio on my personal site</p>
  </figcaption>
</figure>

I really didn’t have too many interesting problems or solutions with the Hugo
transition. Templating has been pretty easy, especially since I’m already
quite familiar with [Go Templates](https://golang.org/pkg/text/template), and
Hugo includes a nice selection of helper functions. Content organization is a
little confusing if you don’t read all of the documentation, but once you
understand it, it makes a lot of sense. I’m still on the fence when it comes
to some of the layout vs content organization, but it works out well.

I did have to come up with a new asset pipeline, especially as I intend to
deploy from [Travis CI](https://travis-ci.org/). I’ve been using
[Sass](http://sass-lang.com/) for my stylesheets since I built this site out
with the [Bourbon](http://bourbon.io), [Neat](http://neat.bourbon.io/), and
[Bitters](http://bitters.bourbon.io/) libraries, and I wanted to continue to
use this setup for my stylesheets. As I began working on a new version of the
personal site on Jekyll, I found that keeping these external dependencies in
the repository was becoming a hassle for upkeep. So, when I shifted over to
Hugo, with no asset pipeline, I decided to use [npm](https://www.npmjs.com/)
and [Gulp](http://gulpjs.com/) to manage the Sass, JavaScript, and other
static assets.

I quickly put together some tasks to pull in Sass for Bourbon,
[normalize](http://necolas.github.io/normalize.css/), and
[Font Awesome](http://fontawesome.io/). It was also pretty easy to add a task
for the Font Awesome font files. It was not so easy to get responsive image
resizing with Gulp.

I found that Gulp was not the right tool for *me* to create responsive image
sizes for the site. This personal site is mainly a portfolio of my art and music
projects, so photos and scanned versions of linocuts make up a large part of the
content. I tried a couple different methods with Gulp, but they all had some C
or C++ dependency at the end of the chain that made me not want to include it in
build scripts – not evil or bad dependencies, just dependencies. I did a little
bit of searching, found a nice
[Imaging Package](https://github.com/disintegration/imaging) for Go, and I built
my own tool. Borrowing from the résumé updating tool I recently built, along
with some other tools I’ve built for batch processing from the command line, I
built a quick and easy, application-specific build tool that will seamlessly
work with any deployment script without dependency Hell. The
[portfolio-images](https://github.com/jessecarl/portfolio-images) command does
exactly what I want.

I built it today, and there is at least one major design change that I have
planned, but it works. The flags and a few other bits were pulled straight
from [resume-update](https://github.com/jessecarl/resume/cmd/resume-update),
with a little extra to work. I could go through what I’ve done here, but it
would be very little more than what you could read on other posts here.
Instead, I think I will save the good parts for next week. I hope to have
the current program flow for the command made into nice
[concurrent pipelines](https://blog.golang.org/pipelines) very soon. I did
try to organize things to make that process easier. If you are feeling up
to a little concurrency fun, please send me a pull request with a solution.
I think it will be fun.
