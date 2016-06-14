---
layout: "post"
title: "Concurrent Portfolio Image Pipelines"
date: "2016-06-14 14:20:00"
category:
  - saas
  - toolbuilding
img: /img/posts/river-valley-md.jpg
---

A couple weeks ago, I had the chance to take the simple [portfolio-images](https://github.com/jessecarl/portfolio-images/)
tool I quickly built on Friday, and improve it. As I mentioned at the end of
[Portfolio Image Pipelines]({% post_url 2016-05-27-portfolio-image-pipelines %}),
I updated the command to utilize [concurrent pipelines](https://blog.golang.org/pipelines).
It was a good exercise to rewrite the main loop to utilize pools of workers
completing tasks concurrently.<!--more-->

Most of the update was fairly straightforward. As I had already decided earlier,
errors on any one image do not stop the overall operation, but are logged for the
sake of the user. Errors are passed onto the error channel to be logged.

```go
errc := make(chan error)

go func(ec <-chan error) {
	for err := range ec {
		log.Printf("[WARNING]: %v", err)
	}
}(errc)
```

The start of the pipeline generates a channel to receive each filename to open.
This allows each iteration of that original loop from the old implementation to
run concurrently.

```go
…
	inputFileCh := QueueImages(done, inputFiles...)
…

func QueueImages(done <-chan struct{}, filenames ...string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for _, n := range filenames {
			select {
			case out <- n:
			case <-done:
				return
			}
		}
	}()
	return out
}
```

With all of our pipeline steps, we include a `done` channel to allow the goroutines
to stop when there is no more work to do.

The next several steps of the pipeline are similar enough to only need to show one.
These middle steps all create a pool of workers to pull from the incoming channel
and push to the outgoing channel.

```go
…
	abortAllSizes := func() { bar.Add(len(imageSizes)) }
	inputImageCh := make(chan *ImageInput)
	var inputWg sync.WaitGroup
	inputWg.Add(workerCount)
	for i := 0; i < workerCount; i++ {
		go func() {
			OpenImages(done, abortCh(abortAllSizes), inputFileCh, inputImageCh)
			inputWg.Done()
		}()
	}
	go func() {
		inputWg.Wait()
		close(inputImageCh)
	}()
…

func OpenImages(done <-chan struct{}, errc chan<- error, filenames <-chan string, imgc chan<- *ImageInput) {
	for n := range filenames {
		// Because we can't send on a nil channel, only assign these when we have something to send
		var send chan<- *ImageInput
		var ec chan<- error

		ii, err := NewImageInput(n)
		if err != nil {
			ec = errc
		} else {
			send = imgc
		}

		select {
		case send <- ii:
		case ec <- err:
		case <-done:
			return
		}
	}
}
```

This simple pattern for pipelines is incredibly simple and powerful. I think it
is also a very clean and easy way to think about a process. After a couple more
process steps, `ReadyImages` and `ResizeImages`, the final step, `SaveImages` is
only slightly different. Instead of waiting to close in a goroutine, this final
step blocks until the operation is complete.

```go
…
	// Step Four: Save Image (end of pipeline)
	var savedWg sync.WaitGroup
	savedWg.Add(workerCount)
	for i := 0; i < workerCount; i++ {
		go func() {
			SaveImages(done, errc, resizedImageCh, successCh, imageQuality)
			savedWg.Done()
		}()
	}
	savedWg.Wait()
	close(done)
	close(errc)
…
```

Overall, the process of making this tool operate concurrently was easy and effective.
Now – assuming the `workerCount` is set sufficiently high – images that require more
processing to complete do not create a bottleneck.

## Future Improvements

As with any project, there are some things I would like to improve when I swing back
around to this again. If you spot something beyond these basic few, please open an
[issue](https://github.com/jessecarl/portfolio-images/issues) or make the change and
send me a pull request.

- base `workerCount` on the number of images or sizes instead of a flag
- move the main operation into a more testable function
- create tests for this testable function
- use benchmarks to compare the pipelined version to the old loop
- use benchmarks to optimize the `workerCount` calculations
