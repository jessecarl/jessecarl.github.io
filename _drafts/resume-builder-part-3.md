---
layout: post
title: Résumé Builder Part III
date: 2016-05-06 16:25:00
category:
  - saas
  - toolbuilding
---

In [Part I]({% post_url 2016-02-24-resume-builder-part-1 %}), I introduced the
tool and the data. In [Part II]({% post_url 2016-02-26-resume-builder-part-2 %}),
I discussed how the tool interacts with the data. Today, I'll take some time to
go through the command line interface for the tool.

Any time I sit down to write a CLI, I try to think of a way to design it for
standard streams. The simplicity and utility of a tool that listens to `stdin`
and sends to `stdout` and `stderr` continues to be my personal favorite UI. If
a tool I build is able to act on lines to produce lines, I have a whole world of
additional tooling that I can employ to make the most of my tool.

I could not think of a simple way to make use of standard streams for the résumé
tool. The major problem is that the particular formats for both the data and the
templates that consume the data cannot be consumed line by line. If the inputs
only work as whole files, it makes more sense to operate on files than on streams.
I will make a tool soon that harnesses the power of the streams, but the résumé
builder is not that tool.

We can start by outlining the basic operations for the tool. It really is as simple
as the following.

```go
func main() {
	// figure out what the user wants and complain if it is not right

	// grab the data

	// grab template files

	// execute templates

	// save résumé files
}
```

Using the [flag](https://golang.org/pkg/flag/) package, we define and document
the information we need from a user in order to build out the résumé files.

```go
type stringSlice []string

func (ss *stringSlice) String() string {
	s := ""
	for _, si := range *ss {
		s += si
	}
	return s
}

func (ss *stringSlice) Set(value string) error {
	for _, s := range strings.Split(value, ",") {
		*ss = append(*ss, s)
	}
	return nil
}

func main() {
	var (
		inputFile     string
		outputDir     string
		templateFiles stringSlice
		forceSave     bool
	)
	flag.StringVar(&inputFile, "i", "", "[required] json input file containing résumé data")
	flag.StringVar(&outputDir, "o", ".", "output directory to save résumé files to")
	flag.Var(&templateFiles, "t", "[required] individual template files to generate résumés. For each template file 'resume.md.tmpl', an output file 'resume.md' will be created")
	flag.BoolVar(&forceSave, "f", false, "force save over existing files")
	flag.Parse()

	if len(inputFile) == 0 || len(templateFiles) == 0 {
		flag.PrintDefaults()
		os.Exit(1)
	}

	if err := createOutputDirIfNotExist(outputDir); err != nil {
		log.Fatal(err)
	}

…

}
```

Some of these are fairly obvious. The `inputFile`, `outputDir`, and `forceSave`
are just simple flags.
