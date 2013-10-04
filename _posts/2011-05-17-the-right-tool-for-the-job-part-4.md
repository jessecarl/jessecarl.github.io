---
layout: post
title: The Right Tool for the Job (Part IV)
date: 2011-05-17 23:15:00
img: /img/posts/decap.jpg
exerpt: "This choice was really the first one I actually had to ruminate on. Once I wrote down my highest priority criteria for database engine selection, I was able to come to a clear conclusion. Let me take you through the process."
---

##Database

This choice was really the first one I actually had to ruminate on. Once I wrote
down my highest priority criteria for database engine selection, I was able to
come to a clear conclusion. Let me take you through the process.

###SQLAlchemy Support

Because I&#8217;m using [Pylons](http://pylonsproject.org/), which uses
[SQLALchemy](http://www.sqlalchemy.org/) by default, I wanted to be sure that
whatever I use will work with SQLAlchemy. Here were my options with this
criteria:

* [DB2](http://www-01.ibm.com/software/data/db2/)
* [Drizzle](http://drizzle.org/)
* [Firebird](http://www.firebirdsql.org/)
* [Microsoft SQL Server](http://www.microsoft.com/sqlserver/)
* [MySQL](http://www.mysql.com/)
* [Oracle](http://www.oracle.com/)
* [PostgreSQL](http://www.postgresql.org/)
* [SQLite](http://www.sqlite.org/)
* [Adaptive Server Enterprise](http://www.sybase.com/products/databasemanagement/adaptiveserverenterprise)

###Open Source

I intend to release this project under an open source license, so the database I
choose should be open source (it doesn&#8217;t have to be, but I want it to be).
Let us look at the licenses for these databases:

<dl>
  <dt>DB2</dt>
  <dd>Proprietary IBM product</dd>
  <dt>Drizzle</dt>
  <dd>Fork of MySQL &#8211; <a href="http://www.gnu.org/licenses/gpl.html" title="GPL">GPL</a></dd>
  <dt>Firebird</dt>
  <dd>Non-standard open source <a href="http://www.firebirdsql.org/en/licensing/" title="license">license</a></dd>
  <dt>SQL Server</dt>
  <dd>Microsoft</dd>
  <dt>MySQL</dt>
  <dd>GPL</dd>
  <dt>Oracle</dt>
  <dd>Propriety beast</dd>
  <dt>PostgreSQL</dt>
  <dd><a href="http://www.opensource.org/licenses/postgresql" title="PostgreSQL">Self titled</a></dd>
  <dt>SQLite</dt>
  <dd><a href="http://en.wikipedia.org/wiki/Public_Domain" title="Public domain">Public domain</a></dd>
  <dt>ASE</dt>
  <dd>Proprietary</dd>
</dl>

###Levenshtein Distance

This is the one that makes the difference. I intend to go to great lengths to
make sure that there is no unintentional duplication of data. The very heart of
this application relies on the intricate relationships modeled in the database.
In order to eliminate human error, the ability to do text search using
[Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) as an
aid to the user in entering data. There is some work going on to
[implement this](https://github.com/mateusza/SQLite-Levenshtein) for SQLite, and
there are several UDFs available for MySQL. But PostgreSQL has
[supplied fuzzy string matching](http://www.postgresql.org/docs/9.0/interactive/fuzzystrmatch.html).

Based on my criteria, PostgreSQL will be my database of choice. MySQL would be a
possibility as well, so long as the Levenshtein distance UDF is installed, but
with the wealth of other features PostgreSQL brings to the table, and the
looming Oracle monster, PostgreSQL is a clear winner.

