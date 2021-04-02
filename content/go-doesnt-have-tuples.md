+++
title = "Go doesn't have tuples"
date = 2021-04-02
[extra]
background = "go-doesnt-have-tuples.png"
[taxonomies]
tags = ["go", "rant"]
+++

# Go doesn't have tuples

If you've programmed Go for more than 2 seconds you might think "this makes no
sense, of course Go has tuples, look at this valid go function"

```go
func the_number_two() (string, int) {
    return "the number two", 2
}
```

> For those that haven't programmed Go, this is a `func`tion called
> `the_number_two` that returns a `string` **and** an `int`

Now that looks like a tuple, and I have no problems with any part of this, on
it's own it's fine and a good thing. Avoids the whole mess that are _out
parameters_ and generally makes code more readable.

## Function chaining

Function chaining (also known as function composition over at the functional
side) is a very common pattern. Usually it looks something like this:

```py
func1(func2("hi"), 1)
```

Here `func2` takes a string a returns something, let's say it returns the length
of the string

```py
func1(len("hi"), 1)
```

From this we can immediately infer that `func1`, whatever it does, takes two
parameters, both of them numbers. Simple stuff.

It is a general assumption that, if a function returns `some type` we can write
a function that can take `some type` as a parameter and thus allow for function
chaining.

_But not with Go._

In Go there are no tuples, it's just not a thing. Multiple return values are
just that, multiple return values.

As such it's impossible to write a function such that this is a valid
expression.

```go
impossible(the_number_two())
```

## Who cares?

To me that simple fact is bad on it's own, but let me contextualise that in the
language.

### Error handling

Another (in)famous feature of Go is its error handling. It's return value based
instead of exception based (I think this is a good thing, I personally dislike
exceptions).

How does it look like? Well simple, a function that can fail returns two values,
the good value and the error value.

```go
func Open(name string) (*File, error)
```

As an example let's try writing a simple program that reads a file, parses it's
contents as a number and prints the number.

First we need to open a file (Import statements will be omitted).

```go
func main() {
    file, err := os.Open("the_answer")
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}
```

As you can see there's this nice syntax that let's you capture both return
values, and we then check if an error occurred, and, in this case we print it
and terminate the program.

Now let's write a function that reads a string from the file

```go
func read(file *os.File) (string, error) {
    buffer := make([]byte, 1024)
    n, err := file.Read(buffer)
    if err != nil {
        return "", err // yes, I have to return an empty string here
    }
    return string(buffer[:n]), nil // err is nil means there was no error
}
```

And let's write one that parses the string

```go
func parse(s string) (int, error) {
    return strconv.Atoi(strings.TrimSpace(s))
}
```

Interestingly we can just return here, despite the fact that we can't chain
functions we can return the multiple values of a function. I can't really put my
finger on it but to me this is inconsistent.


And finally let's put it all together in `main`.

```go
func main() {
    file, err := os.Open("the_answer")
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
    c, err := read(file)
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
    v, err := parse(c)
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
    fmt.Println("The number is ", v)
}
```

_Ooof_ that's a lot of repeated code!

And another pain point of this is that it doesn't force you to check the error
and even if you do it won't prevent you from accessing the meaningless "good"
value. In fact, it's so easy to miss, the first time I wrote this program the
file had a non number in it and because I forgot to `os.Exit` inside the `if`s
the program read `0` from `v`. A meaningless default and wrong value.

If there was a way to chain functions like this, assuming the error propagates
wherever it happens.

```go
func main() {
    v, err := parse(read(os.Open("the_answer")))
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}
```

This program would
- Have the same behaviour
- Reduce the amount of times you can forget to check
- Be much clearer on what it does.


But having this kind of error propagation usually involves either exceptions or
complex control flow features, and both are against Go's philosophy of simplicity
first.

Now another thing a programmer usually does when there is too much repeated code
is to try to abstract it away into a function.

```go
func check_err(???) (?) {
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}

func main() {
    file := check_err(os.Open("the_answer"))
    c := check_err(read(file))
    v := parse(c)
    fmt.Println("The number is ", v)
}
```

Once again, this isn't possible because we can't take a "tuple" as a parameter.

Furthermore, even if we could, we couldn't make this function because Go doesn't
have generics, and as such, there would be no way to express that the non error
type taken would be the type returned. In other words, you can't implement `id`.

The only thing we can do is this:

```go
func handle_err(err error) {
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}

func main() {
    file, err := os.Open("the_answer")
    handle_err(err);

    c, err := read(file)
    handle_err(err);

    v, err := parse(c)
    handle_err(err);

    fmt.Println("The number is ", v)
}
```

Which is _ok_ but far from a solution as good as any of the previous ones.

## Conclusion

Go as a lot going for it, it's simplicity is nice as a baseline, but, like
everything, it's bad or even toxic when taken to an extreme. In it's quest to be
simple go ends up making writing correct code error prone through it's
repetitiveness.
