---
layout: post
title: The Basic Schema
date: 2011-05-20 08:05:00
img: /img/posts/basic-schema.jpg
---

With some of the tools chosen, it is time to create my database schema, or
something like it. Below is my first guess at what the basic organization should
be. Notice that `Songs` and `Tracks` are separate. This reflects the reality of
`Songs` being intangible objects while `Tracks` are physical manifestations of
those `Songs`. `Tracks` are the shadows on the wall of the cave (thank you,
Plato).<!--more-->

<div class="thumbnail">
  <img src="/img/posts/basic-schema.jpg" alt="First Approximation (fails some edge cases)" />
  <h4>First Approximation (fails some edge cases)</h4>
</div>

The relationships shown above are oversimplified, despite being about as much
information as provided by most other methods for storing this kind of data.
Let&#8217;s dig deeper into these relationships.

##Song&#8211;Creator Relationship

<div class="thumbnail">
  <img src="/img/posts/song-creator.jpg" alt="Song Creator" />
</div>

Let&#8217;s first define a `Creator` as a person who is either a composer,
lyricist, or both. The `Song_Creator` entity links `Creators` &#8211; who are
not limited to being any one `Creator_Type` &#8211; to `Songs`. Additionally,
`Songs` often have a primary `Creator` rather than equal contributers, so we
also want to put this in our representation of that interaction. A final note
on the `Song&#8211;creator` relationship: the diagram appears to show a
many-to-many relationship between `Song` and `Song_Creator` when it is really a
one-to-many relationship where `Song` has many `Song_Creators`.

##Song&#8211;Track Relationship

<div class="thumbnail">
  <img src="/img/posts/song-track.jpg" alt="Song Track" />
</div>

I&#8217;ve already outlined why these exist as separate entities. The
relationship here is many-to-many to account for not only the many different
recordings of the same song but also to account for medleys.

##Album&#8211;Track Relationship

<div class="thumbnail">
  <img src="/img/posts/album-track.jpg" alt="Album Track" />
</div>

It is already assumed that `Albums` can have multiple `Tracks`, but we also
assert that `Tracks` can be released on multiple albums (ex. singles,
compilations, etc.). `Album_Tracks` represent the relationship here with the
addition of the track number. `Album_Sides` are pulled out here for the moment,
but they could easily be rolled into the `Album_Track` entity as a property.

##Performer&#8211;Track Relationship

<div class="thumbnail">
  <img src="/img/posts/performer-track.jpg" alt="Performer Track" />
</div>

This is the most intricate real-world relationship we model here. We relate to
`Tracks` rather than `Albums` here because of the common cases of compilations
and guest musicians. We model performers as both `Musicians` and `Ensembles`.
Each `Performance` represents an individual contribution to the `Track`. This
contribution also relates whether the `Musician` is a primary contributer and
what, if any, `Ensemble` they are a part of on this `Track`. An `Ensemble` is
considered primary if any of the `Musicians` in the `Ensemble` are primary.

Further iterations of this model may see the addition of roles to
`Performances`, which would allow the merger of `Musicians` and `Creators`. The
relationship between a `Musician` and a `Track` is so close to the relationship
between a `Creator` and a `Song` that they could be easily merged.

I have done all I can think to account for edge cases. As I start building out
tests and building out the models, I will need more edge cases to test against.
Feel free to leave me comments with albums that you think might break my model.

