---
layout: post
title: The Right Tool for the Job (Part II)
date: 2011-05-10 21:26:00
img: /img/posts/all-on-my-own.jpg
---
In <a href="/2011/05/01/the-right-tool-for-job.html" title="Part I">Part I</a>,
I spent time belittling all but the languages that make me happy
(<a href="http://www.python.org/" title="Python">Python</a> and
<a href="http://golang.org/" title="Go">Go</a>). I didn&#8217;t explain exactly
why I ultimately chose Python; in the end, the architecture/framework choice
pushed me into the Python camp.<!--more-->

In my investigation of possible architectures for this simple project, I think
that I have finally cataloged all of the possible architectures for a web
application such as this one:

* Model View Controller
* Spaghetti

Is it an oversimplification? Maybe. Does it really matter? Nope. Just about
everything I could find with any structure at all was some variation of the same
basic concept <a href="http://folk.uio.no/trygver/themes/mvc/mvc-index.html">as
described by Trygve Reenskaug</a>.

> The essential purpose of MVC is to bridge the gap between the human user's
> mental model and the digital model that exists in the computer.

Knowing that I will be using MVC rather than spaghetti, I can move on to the real
question: how much of the work should the framework do?

###Leave me alone, I&#8217;ll do it myself!

This could be a good option, but it will mostly be reinventing wheels (a noble,
maligned art). It is probably a good exercise to do this on a small scale at some
point, if only to gain a deeper understanding and appreciation for the strength of
the existing libraries and frameworks. If I were to do this, I would probably choose
a smaller project and use Go.

###Do it for me?

The metaprogramming bug hits all of us at some point; of course, there is a huge
amount of complexity involved in making this happen. The rise of frameworks like
&#8211; the 800 lb gorilla of the web framework world &#8211;
<a href="http://rubyonrails.org/" title="Rails">Rails</a> and others embracing
&#8220;convention over configuration&#8221; take care of the complex parts for you.
Honestly, these do a great job&#8230; so long as *all* of the basic assumptions remain
true. I plan on deviating from some of those assumptions, and while I know these
frameworks do not preclude me from doing this, they often make it significantly more
difficult to do.

###I still have a library card!

Some of those really important components in the architecture have been built to
stand alone. Slightly easier than rolling your own everything, libraries like
<a href="http://www.sqlalchemy.org/" title="SQLAlchemy">SQLAlchemy</a>,
<a href="http://www.makotemplates.org/" title="mako">mako</a>, and
<a href="http://routes.groovie.org/" title="Routes">Routes</a> (those of you who
are clever already see where this is headed) take care of the heavy lifting,
giving you the freedom to build your application exactly the way you envision it.
The major downside to this approach is that changing libraries can be difficult
when you have built everything around particular libraries.

###Just a touch of awesome

There is one framework with the perfect balance of structure and flexibility:
<a href="http://pylonsproject.org/" title="Pylons">Pylons</a>. Pylons is
effectively a lightweight glue holding together libraries responsible for the
real work. I have no problems with assumptions not applying to my project, and
I can easily replace the libraries without having to completely rewrite. I spent
a good bit of time exploring different frameworks, and Pylons (soon enough to
become Pyramid) has minimal development overhead with maximum flexibility.

###TL;DR

[Pylons](http://pylonsproject.org/ "Pylons") is the ideal framework for my project.

