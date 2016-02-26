---
layout: post
title: Résumé Builder Part II
date: 2016-02-26 16:25:00
category:
  - saas
  - toolbuilding
---

In [Part I]({% post_url 2016-02-24-resume-builder-part-1 %}), I wrote about the
inspiration for the tool, and walked through transforming free-form data into a
more structured form. Today, we'll work on how our tool will work with the data.<!--more-->

Our résumé is defined fairly easily, based on the json file we already created.
If the ultimate intention is only to correctly read from the json file, we can
omit the tags. Since I might want to have my tool output json in the future, I
went ahead and added tags to enforce the lowerCamelCase I like for my json keys.

```go
// Container for all information used to present a CV or Résumé
type Resume struct {
	Contact     Contact      `json:"contact"`
	Objective   string       `json:"objective"`
	Experiences []Experience `json:"experiences"`
	Skills      []string     `json:"skills"`
	Education   []Education  `json:"education"`
	Awards      []Award      `json:"awards"`
}
```

Let's start by defining a type to represent our first résumé section. Most
of the fields here are very simple to define. The `Address` struct can be
defined directly inside the `Contact` struct because we do not intend to
add any methods. The `Phone` type however, will need a little more attention.

```go
type Contact struct {
	Name    string `json:"name"`
	Address struct {
		StreetAddress string `json:"streetAddress"`
		Locality      string `json:"locality"`
		Region        string `json:"region"`
		PostalCode    string `json:"postalCode"`
	} `json:"address"`
	Phone []Phone `json:"phone"`
	Email string  `json:"email"`
}
```

The `Phone` type requires some more detailed implementation. I've added an
additional field here representing an extension. Making `Extension` independent
of `Number` gives us some more powerful options for handling the number down the
line. We also provide a `PrimaryPhone()` method on the `Contact` type to select
only the first phone listed as primary. This further clarifies the behavior we
discussed in Part I.

```go
type Phone struct {
	Type      PhoneType   `json:"type"`
	Number    PhoneNumber `json:"number"`
	Extension string      `json:"extension"`
	Primary   bool        `json:"primary"`
}

// Use to select only a single, primary phone number. Selects the first phone listed as primary.
func (c Contact) PrimaryPhone() *Phone {
	var p Phone
	for _, p = range c.Phone {
		if p.Primary {
			return &p
		}
	}
	return nil
}
```

We want to have a consistent set of phone types available. It would not serve to
have "mobile", "cell", "iphone", or other inconsistent names for the same basic
thing. Enter one of the more fun and interesting recent features in go:
[generate](https://blog.golang.org/generate).

```golang
type PhoneType int

//go:generate stringer -type=PhoneType
//go:generate jsonenums -type=PhoneType

const (
	unknown PhoneType = iota
	mobile
	home
	office
	other
)

func (t PhoneType) Short() string {
	typeMap := map[PhoneType]string{
		unknown: "",
		mobile:  "m",
		home:    "h",
		office:  "o",
		other:   "",
	}
	return typeMap[t]
}

func (t PhoneType) Title() string {
	return strings.ToTitle(t.String())
}
```

There are a number of uses for the generate tool, but one of the simplest is
the `stringer` tool that creates a `String()` method on an `int` type used as
an `enum`. The `jsonenums` tool is based on the `stringer` tool, but provides
`UnmarshalJson()` and `MarshalJson()` for the type. One small caveat in this
tool, and one that may be worth writing a custom tool for in the future, is
that the methods are all case sensitive. This could prove problematic for
writing the json by hand – enforcing all lowercase is non-obvious here. For
now, we can leave it. I did add a couple of little helper methods we can use
when executing templates. The `Title()` and `Short()` methods provide some
formatting options.

The last part of the `Phone` type to be addressed is the actual `Number`
property. We could have left this as a string, but in order to add some
flexibility to the formatting, we added a specific type. Being in the
United States, I created methods specifically to deal with the [North
American Numbering Plan](https://en.wikipedia.org/wiki/North_American_Numbering_Plan).
But, I can't allow my implementation to be incompatible with phone numbers in
other countries – it's a small world these days. Instead, the `PhoneNumber`
type is just a string, and it can be used transparently. The method used to
enforce the NANP standard, `cleanPhoneNumber()`, returns an error we can
check against. When we call our formatting methods, if we see the `ERROR_NOT_NANP_NUMBER`,
we can act accordingly. We do not have to treat all errors equally. I didn't
take advantage of this in my formatting methods, but the option is there for
future additions.

```golang
// Phone Number (for now, expects 11, 10, or 7 digit number)
type PhoneNumber string

var ERROR_NOT_NANP_NUMBER = errors.New("Phone Number is not a valid North American Numbering Plan phone number.")

// Removes non-numeric chars from phone number.
// If the resulting length is not 11, 10, or 7 digits, returns ERROR_NOT_NANP_NUMBER.
func (n PhoneNumber) cleanPhoneNumber() (PhoneNumber, error) {
	m := strings.Replace(strings.Map(func(r rune) rune {
		if r >= '0' && r <= '9' {
			return r
		}
		return 'x'
	}, string(n)), "x", "", -1)
	if len(m) != 11 && len(m) != 10 && len(m) != 7 {
		return n, ERROR_NOT_NANP_NUMBER
	}
	return PhoneNumber(m), nil
}

// Format phone number as NANP (North American Numbering Plan) "1 (NPA) NXX-XXXX"
// If the number is not a valid NANP number, the original number is returned unformatted.
func (n PhoneNumber) FormatTraditional() string {
	m, err := n.cleanPhoneNumber()
	if err != nil { // this includes ERROR_NOT_NANP_NUMBER
		return string(n)
	}
	b := []byte(m) // make a copy to parse. We can do this by byte because 0-9 are represented as single bytes
	s := ""
	if len(b) == 11 {
		s += string(b[0])
		b = b[1:]
	}
	if len(b) == 10 {
		s += "(" + string(b[0:3]) + ") "
		b = b[3:]
	}
	if len(b) == 7 {
		s += string(b[0:3]) + "-" + string(b[3:])
	}
	return s
}

// Format phone number as NANP (North American Numbering Plan) "1-NPA-NXX-XXXX"
// If the number is not a valid NANP number, the original number is returned unformatted.
func (n PhoneNumber) FormatSeparator(sep string) string {
	m, err := n.cleanPhoneNumber()
	if err != nil { // this includes ERROR_NOT_NANP_NUMBER
		return string(n)
	}
	b := []byte(m) // make a copy to parse. We can do this by byte because 0-9 are represented as single bytes
	s := ""
	if len(b) == 11 {
		s += string(b[0]) + sep
		b = b[1:]
	}
	if len(b) == 10 {
		s += string(b[0:3]) + sep
		b = b[3:]
	}
	if len(b) == 7 {
		s += string(b[0:3]) + sep + string(b[3:])
	}
	return s
}
```

I created two formatting methods that rely on the same basic technique. Starting
with a clean number consisting of only the characters `0123456789`, I can assume
each is only a single byte, allowing me to directly address the byte slice
instead of iterating through characters. See the golang blog post, [Strings,
bytes, runes and characters in Go](https://blog.golang.org/strings), for more
information about this potential pitfall. I could probably have used a `switch`
instead of the `if` statements, but I think that would not have been as clear
and obvious to another developer taking a quick look.

With these types defined, a template like the following becomes fairly easy to
navigate (the `-` in the brackets is a nice new feature of [go 1.6](https://golang.org/doc/go1.6#template)):

```golang
{% raw %}
{{range .Contact}}
{{- .Name}}
{{range .Address}}
{{- .StreetAddress}}
{{.Locality}}, {{.Region}} {{.PostalCode -}}
{{end}}
{{with .PrimaryPhone}}
{{- .Number.FormatTraditional -}}{{with .Extension}} ext. {{. -}}{{end}}
{{end}}
{{.Email -}}
{{end}}
{% endraw %}
```

Next time, we'll talk more about the design of the CLI.
