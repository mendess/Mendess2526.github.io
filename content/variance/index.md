+++
title = "Investigating Variance"
date = 2020-06-23
#[extra]
#background = ""
+++
# Investigating Variance

Variance is a niche in type theory that I have recently taken an interest in
exploring. This will be split in a few parts.

- [C++](cpp.md)
- [Java](java.md)
- [Rust](rust.md)

I might add more languages as time passes if I find more interesting things to
explore.

## What is subtyping

_Wait, wasn't this about variance_

Subtyping (and the inverse supertyping) is a relation between types.

Some type `Derived` is a subtype of `Base` if some piece of code designed to
work with `Base` can also work with `Derived`.

This relation is often written as `Derived <: Base`.

A common way to observe subtyping in mainstream programming languages is through
inheritance, it is the most obvious way but not the only way.

The classic example, illustrated in Java, being:

```java
class Animal {}

class Cat extends Animal {}
```

Here `Cat` is a subtype of `Animal` or just `Cat <: Animal`.

## What is variance

> Variance is how subtyping between more complex types relates to to subtyping
> between their components
[<sup>\[wikipedia\]</sup>](w_variance)

What this means is, given a type `T`, supertype of `Derived` (`Derived <: T`),
can a function that takes a `T` also take `Derived`.

```rust
// Function that returns a `Derived`
fn make_a_derived() -> Derived;

T t = make_a_derived();
```

## Types of variance.

### Invariance

The simples kind of variance is **invariance**. Invariance means that, where a
`T` is expected only `T`s can be provided.

If the above pseudo language's assignment to variables are **invariant**
then it will not compile since `Derived != T`.

Invariance is nice because it guarantees type safety, which I'll lightly explain
later. But it comes with a big downside: The number of programs that can be
accepted is much smaller despite being, or seeming, correct.

### Covariance

The more natural other kind of variance is **covariance**. This is when the
"order of the types" is respected, where the order is from most subtype to most
supertype.

If, in the above example, assignments are **covariant**, then that program is
correct and compiles.

Covariance is nice because it's intuitive but it's dangerous when mutation and
reference types are mixed (To be explored in future posts).

### Contravariance

Contravariance is the opposite of covariance, as such the "order of the types" is
inverted. It's usually harder to observe so I'll put off adding examples to the
relevant posts where contravariance can actually be observed.

[w_variance]: https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)
