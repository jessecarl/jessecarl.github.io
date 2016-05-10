---
layout: post
title: Résumé Builder Part III
date: 2016-05-10 16:30:00
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

	…
}
```

Some of these are fairly obvious. The `inputFile`, `outputDir`, and `forceSave`
are just simple flags. The more interesting flag is `templateFiles`. With the
other flags, we only needed to concern ourselves with a single value, but we
want to parse multiple template files for the résumé. One option would be to
impose a convention that all the template files would be in a given directory,
and all templates would be parsed every time. I don't like that. I think it puts
too much burden on the consumer of the API without adding any benefit. Instead,
I think a better, more explicit way is to have a flag that accepts multiple
values. The [flag](https://golang.org/pkg/flag/) package provides a clean and
flexible way for us to do this. Implementing the `flag.Value` interface allows
custom types and customized parsing for flags. In this case, we made the
`stringSlice` to allow the user to pass template file names as a comma-separated
list and as multiple `-t filename.xyz.tmpl` flags in the command. I think this
is a cleaner, more flexible, easier to think through interface.

We also take the time here to check that the required flags are passed, and to
check for and create the output directory for the generated résumé files. That
quick and easy bit is shown below.

```go
func main() {
	…

	if err := createOutputDirIfNotExist(outputDir); err != nil {
		log.Fatal(err)
	}

	…
}

func createOutputDirIfNotExist(outputDir string) error {
	info, err := os.Stat(outputDir)
	if err == nil {
		if info.IsDir() {
			return nil
		} else {
			return errors.New("Cannot replace file with directory")
		}
	} else if !os.IsNotExist(err) {
		return err
	}
	return os.MkdirAll(outputDir, os.ModePerm|os.ModeDir)
}
```

According to our original outline, we need to grab the data next. Because of
the work that we did previously, this step becomes fairly trivial boilerplate.

```go
func main() {
	…

	// grab the data
	resume, err := getResumeFromFile(inputFile)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Loaded Résumé data from %q", inputFile)

	…
}

func getResumeFromFile(in string) (resume *Resume, err error) {
	var resumeJson []byte
	resume = new(Resume)
	resumeJson, err = ioutil.ReadFile(in)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(resumeJson, resume)
	if err != nil {
		return nil, err
	}
	return resume, nil
}
```

Next, we grab the template files. The `resumeVersion` type, which we may explore
in another post, represents not only the template, but the specific output and
destination of that template. For the purposes of the command line interface, we
only need to know that the `resumeVersion` parses the templates
(`newResumeVersion()`), executes the templates (`rv.Execute()`), and saves the
resulting files (`rv.Save()`).

```go
func main() {
	…

	// grab template files
	var rvs []*resumeVersion
	for _, t := range templateFiles {
		if rv, err := newResumeVersion(t, outputDir); err != nil {
			log.Printf("Failed to load %q: %v", t, err)
		} else {
			rvs = append(rvs, rv)
			log.Printf("Loaded template: %q", t)
		}
	}

	…
}
```

Did you notice anything about the error handling above? It's only a very small
detail, but it speaks to what I find to be one of Go's greatest strengths. Go
forces you to care about the nature of every error. In this case, the error
really is some kind of failure to properly load the template. It doesn't matter
why the template failed to load, so we don't need to look beyond whether there
was an error or not. Each of the templates are essentially independent of one
another, so other then telling the user that there was a problem with one of the
template, I see no reason to stop execution. This could probably be improved on
with a prompt, asking the user if they would like to abort the whole operation,
but it would be overkill for this small an application.

The execute and save steps follow this same pattern.

```go
func main() {
	…

	// execute templates
	var executed []*resumeVersion
	for _, rv := range rvs {
		if err := rv.Execute(*resume); err != nil {
			log.Printf("Failed to execute %q: %v", rv.Name(), err)
		} else {
			executed = append(executed, rv)
			log.Printf("Executed template: %q", rv.Name())
		}
	}

	// save résumé files
	for _, rv := range executed {
		if err := rv.Save(forceSave); err != nil {
			log.Printf("Failed to save %q: %v", rv.Name(), err)
		} else {
			log.Printf("Saved: %q", rv.Name())
		}
	}

	…
}
```

In a future post, I will be discussing the design of the `resumeVersion` type
and going more in depth on why we even need it. The little bit I want to
address now is concurrency. Go is known for making concurrency first class in
the design of the language. Therefore, it becomes habit to think of program flow
in terms of sharing by communicating. Here, I chose to encapsulate all the
important information into individual units that can be passed to the next steps
without need to coordinate with any outside information or operations. It might
be tempting to handle loading, executing, and saving as a single step for each
template. It would certainly be less code. We would not need a `resumeVersion`
type at all. And with a tool this size, and operations this inexpensive, that
would be a justifiable choice. However, by separating these operations, we open
up some potential future performance improvements and make the code easier to
reason about in the process. I have other projects that are higher priority at
the moment, so I will leave it as "an exercise for the reader" to make this
simple improvement for now. Go ahead and fork [the project](https://github.com/jessecarl/resume/),
use the tool, and submit your improvements as pull requests.
