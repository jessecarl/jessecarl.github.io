---
layout: post
title: Resume Builder Part I
date: 2016-02-24 17:00:00
category:
  - consulting
  - saas
  - toolbuilding
img: /img/posts/ada-at-rest.jpg
---

For the last three years, I’ve been touring the country in a van with four other young folks, playing bass on stage at house-shows, festivals, performing arts concerts, and a multitude of small venues. This did not leave me with much time for programming projects. I did build a robust web application to run the band website, but that was mostly software therapy to sooth my brain. Now, I’m no longer spending all that time on the road, and it’s time to update my résumé.<!--more-->

<figure class="thumbnail">
  <img src="{{ page.img }}" alt="My touring bass">
</figure>

In college, when it was time to apply for jobs as an electrical engineer (in a job market where even the most employable degrees were depressed), I decided to make myself stand out from the crowd. I typeset my résumé with `LaTeX`. My résumé was the most beautifully typeset pdf I had ever seen. If I recall, it got a couple nice comments from the few engineers who actually got to see it. Ultimately, a vast majority of jobs I applied for had automated systems, and even if they allowed an upload, it was simply scraped for the text and saved as pure text. So much for beauty…

I still love looking at my `LaTeX` version, but this time around, I plan to keep a text and probably a markdown or html version as well. One of the problems I encountered last time I made an update to my résumé was that of keeping all the versions in sync. This was especially painful when I was creating targetted versions for the kind of work I was interested in – software, electrical engineering, substitute teaching, drink pouring, etc. Keeping different versions was as simple as `git branch drink-pouring`, but then I still had to update more than one document with the same exact information.

I am a proudly lazy engineer. Why do something by hand over and over if it can be automated? With little to do on the software front but my own pet projects for a couple of weeks, I could eschew the usual cost-benefit analysis, weighing the amount of time I would save and the reduction in error against the time it would take to build a tool. Had this been a different time, I might not have decided to build a résumé update tool, but here we are.

To start, I took the best version of my résumé content, and organized it into json. I find that by organizing any set of data into json structures, I can quickly address issues with inconsistent data. Let’s look at phone numbers: in the contact portion of the structure, we have the following:

```json
{
  "contact":{
    "name":"Jesse Allen",
    "address":{
      "streetAddress":"9750 N Paseo Corona",
      "locality":"Tucson",
      "region":"AZ",
      "postalCode":"85737"
    },
    "phone":[{
      "type":"mobile",
      "number":"5208507298"
    },{
      "type":"other",
      "number":"5203024945",
      "primary":true
    }],
    "email":"jesse@jessecarl.com"
  },
  …
```

Rather than have `phone` be a simple text field, I chose to represent phone numbers as more structured data, and rather than have `phone` be a single datum, I chose to make it an array. I could have made `address` an array as well, but I discovered some time ago that multiple addresses on a résumé is trouble. Note that I chose to use a `primary` flag, rather than rely on the order in the array. In producing a human-readable document, which is one reason I go to json so much, it becomes important that intended behavior is explicit. We could assume that the phone numbers are listed such that the first number is most important, but one would have to know implementation details to be sure. Instead, by making `primary` an explicit property, we inform the implementation.

Continuing through the file, we find more we can discuss.

```json
{
  …
  "objective":"Obtain part time of rull time work as a software engineer.",
  "experiences":[{
    "type":"work",
    "cvOnly":false,
    "organization":"Run Boy Run LLC",
    "location":"Nationally",
    "role":"Co-Owner/Bassist",
    "startDate":"2009-08-01T00:00:00Z",
    "endDate":"2016-01-01T00:00:00Z",
    "tasks":[
      "Writing, arranging, recording, and performing original and traditional music.",
      "Creating and supervising the creation of promotional materials, artwork, multimedia, etc.",
      "Appearances on A Prairie Home Companion with Garrison Keillor, Telluride Bluegrass Festival, and more.",
      "K-12 educational residencies through ASU Gammage, The Musical Instrument Museum, and others across the country."
    ]
  },{
  …
    "type":"volunteer",
    "cvOnly":false,
    "organization":"Chicago Urban Project (InterVarsity)",
    "location":"Lawndale Neighborhood, Chicago, IL",
    "role":"Volunteer/Participant",
    "startDate":"2004-06-01T00:00:00Z",
    "endDate":"2004-08-01T00:00:00Z",
    "tasks":[
      "Worked with other College and High School students to teach a K-8 summer tutoring program through a collaboration of InterVarsity and Lawndale Christian Development Corporation."
    ]
  }],
  …
```

We can see here that the experiences, noted on a typical résumé as something like "Work & Volunteer Experience," can be divided according to `type`, can be sorted by `startDate` or `endDate`, and can be hidden on the classically short résumé (as opposed to the full CV). Some fields that might be tempting to make more structured, like `location` or `role` are purposefully left unstructured here. When touring nationally or working in a specific neighborhood, we need to have the flexibility that a more structured `city` and `state` cannot afford. These same patterns of recognizing where data needs to be more or less structured continue through the rest of the document.

```json
  …
  "skills":[
    "Go (golang)",
    "Javascript",
    "LESS/SASS/CSS",
    "C/C++",
    "Python",
    "SQL",
    "Matlab",
    "Verilog",
    "Spice",
    "LaTeX"
  ],
  "education":[{
    "institution":"The University of Arizona",
    "location":"Tucson, AZ",
    "degree":[{
      "type":"Bachelor of Science",
      "fieldOfStudy":["Electrical Engineering"],
      "minor":[
        "Mathematics",
        "Computer Engineering"
      ]
    }],
    "date":"2008-12-01T00:00:00Z"
  }],
  "awards":[{
    "organization":"Senior Design Competition",
    "award":"Best Overall Project",
    "description":"Designed a thermostat reference design for Texas Instruments. Was responsible for user interface hardware and software as well as the overall software organization.",
    "date":"2007-12-01T00:00:00Z"
  },{
    "organization":"Boy Scouts of America",
    "award":"Eagle Scout",
    "description":"Held various leadership positions. Planned and led project to collect clothing and other donations from about 1000 homes for Gospel Rescue Mission.",
    "date":"2002-05-01T00:00:00Z"
  }]
}
```

That is an organized document that can be read just as easily by a human as by a machine. I find it a helpful practice, when looking at any content, to restructure it into json. I could use any number of formats, but I find that json strikes the balance between the high overhead of a document in XML and the lack of explicit structure in a YAML document. Try it with some of your own data.
