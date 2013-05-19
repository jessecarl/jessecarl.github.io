---
layout: post
title: Beyond Many-To-Many
date: 2011-05-24 22:01:00
img: /img/posts/song-creator.jpg
exerpt: "As I work through this project, I will be sharing some of what I think are interesting choices that I make. I have started building out the model classes as outlined in [The Basic Schema](/2011/05/20/the-basic-schema.html). The `Song`&#8211;`Creator` relationship was the first to be built."
---

As I work through this project, I will be sharing some of what I think are
interesting choices that I make. I have started building out the model classes
as outlined in [The Basic Schema](/2011/05/20/the-basic-schema.html). The
`Song`&#8211;`Creator` relationship was the first to be built.

<div class="thumbnail">
  <img src="/img/posts/song-creator.jpg" alt="Song Creator" />
</div>

In building these models, it became clear that the original thought was not
quite clear. First, we have unneeded redundancy with the `Creator` and `Person`
models, so we can bypass the `Creator` entities altogether. Now that we no
longer have the one-to-one proxy between `Song_Creator` and `Person`, we can
rename `Song_Creator` to the more terse, `Creator`. I hope I haven&#8217;t lost
you here.

The `Song`, `Person`, and `CreatorType` entities were easy to define, so I
won&#8217;t go into any detail there. The fun is in the `Creator` entity. There
are a couple of things I want to take note of here:

* There is a three dimensional many-to-many(-to-many) relationship here.
* The primary key is a composite of the three foreign keys.

{% highlight python %}
class Creator(Base):
    __tablename__ = "creator"

    primary = Column(Boolean)
    song_id = Column(Integer, ForeignKey('song.id'), nullable=False,
                     primary_key=True)
    creator_type_id = Column(Integer, ForeignKey('creator_type.id'),
                             nullable=False, primary_key=True)
    person_id = Column(Integer, ForeignKey('person.id'), nullable=False,
                       primary_key=True)

    song = relation('Song', backref=backref('creator', order_by=id))
    creator_type = relation('CreatorType',
                            backref=backref('creator', order_by=id))
    person = relation('Person', backref=backref('creator', order_by=id))
{% endhighlight %}

Now, I am in no way an expert database administration, so I have no idea if any
of this is really the right way to model this, but it looks like it will work.
Please feel free to [take a look](https://github.com/jessecarl/pyFidelity/ "pyFidelity on GitHub")
or share your thoughts.

