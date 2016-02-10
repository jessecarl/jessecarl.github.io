---
layout: post
title: Overengineering, Interfaces, and Function Types
date: 2013-10-09 16:15:00
---

When I started the [go-pubsub](http://github.com/jessecarl/go-pubsub) project,
I was in love with [Interfaces](http://golang.org/ref/spec#Interface_types).
I still am, but I found that the design I was coming up with for my package
was getting clunky, and difficult to work with.<!--more-->

As I began building simple test `Publisher` and `Subscriber` types, I really
felt the complexity was too great for what the package does. The first part of
the original design to go had to be the `Filter` interface. It is frankly, a
bit enterprisy and paranoid.

{% highlight go %}
// Filters are an identifiable interface used to specify
// what results a Publisher should send over a channel
type Filter interface {
  Identify() string
}
{% endhighlight %}

I'm pretty sure we can just use a string, or if we really do need something
flexible, we can shift that over to an `interface{}` instead, and leave the
creation of unique channels to the `Publisher` implementation.

The next problem that became apparent was that we were imposing some very
strict implementation constraints on consumers of the package. By making
`Publisher` and `Subscriber` into interfaces, we have made it necessary
for the consumer to modify the implementation of their service to match
our package. This may be an impractical constraint, particularly if the
consumer would have to extend or rewrite some other third-party package.

So, how do we move away from this design while keeping the basic mechanic
the same? To be more specific, how do we create an API that imposes less on
the consumer while avoiding duplication of channels?

A simpler API to program against here is to drop the `Identify()` method
from our interfaces.

{% highlight go %}
type Publisher interface {
	Publish(Filter) (<-chan Message, chan<- bool, error)
}

type Subscriber interface {
	Subscribe() (chan<- Message, <-chan bool, error)
}
{% endhighlight %}

Well, now we only have a single method, and since we really only
ever call the method once in use, then discard the `Publisher`
and `Subscriber`, we can accept the function itself as a first class
object.

{% highlight go %}
type Publisher func(filter string) (m <-chan Message, stop chan<- bool, err error)

type Subscriber func() (m chan<- Message, stop <-chan bool, err error)
{% endhighlight %}

That makes the API nice and clean, allowing the consumer to have more
control over implementation, but does it still allow us to avoid duplication of
channels? Yes. In my first implementation, I had forgotten that channels are
comparable, making the need for all of the maps, key generation, `Identify()`
methods, etc. entirely not needed. Overall, this should not only prevent duplicate
channels, but it will do it better than the original design.

Now I just have to write tests for the new design, and implement the changes.
