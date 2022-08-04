# eibens/swayze

TypeScript function evaluation, but lazy. Cool like P. Swayze.

<!-- badges -->

[![License](https://img.shields.io/github/license/eibens/swayze?color=informational)](LICENSE)
[![Repository](https://img.shields.io/github/v/tag/eibens/swayze?label&logo=github)](https://github.com/eibens/swayze)
[![ci](https://github.com/eibens/swayze/actions/workflows/ci.yml/badge.svg)](https://github.com/eibens/swayze/actions/workflows/ci.yml)

<!-- /badges -->

# Example

Imagine a program that takes two arguments `a` and `b` and calculates four
values `c`, `d`, `e`, and `f` with the following formulas:

```
c = a + b
d = a * b
e = c + d
f = c * d
```

For the sake of this example, imagine the `+` and `*` operations are very
expensive. The code below shows how swayze can help optimize this program:

```ts
// import the swayze DSL functions
import { arg, fun } from "./mod.ts";

// define some pure functions that are potentially expensive
const add = (x: number, y: number) => a + b;
const mul = (x: number, y: number) => a * b;

// define the DAG with two arguments a and b, and derived values c, d, e, and f
const a = arg(0);
const b = arg(0);
const c = fun(add, a, b);
const d = fun(mul, a, b);
const e = fun(add, c, d);
const f = fun(mul, c, d);

// set new argument values
a.set(2);
b.set(3);

// calculates values c, d, and e for the first time
e.get();

// calculates value f and uses cached values of c and d
f.get();

// uses cached values of e and f
e.get();
f.get();
```
