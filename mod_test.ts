/** EXTERNALS **/

import { assertEquals } from "https://deno.land/std@0.151.0/testing/asserts.ts";

/** LOCALS **/

import { arg, fun } from "./mod.ts";

/** HELPERS **/

function add(x: number, y: number) {
  console.log(`${x} + ${y}`);
  return x + y;
}

function mul(x: number, y: number) {
  console.log(`${x} * ${y}`);
  return x * y;
}

function create() {
  // input
  const a = arg(0);
  const b = arg(0);

  // internal and reused
  const c = fun(add, a, b);
  const d = fun(mul, a, b);

  // output
  const e = fun(add, c, d);
  const f = fun(mul, c, d);

  return {
    a: a.set,
    b: b.set,
    e: e.get,
    f: f.get,
  };
}

/** MAIN **/

Deno.test("test", () => {
  const { a, b, e, f } = create();

  assertEquals(e(), 0);
  assertEquals(f(), 0);

  a(2);
  b(3);

  assertEquals(e(), 11);
  assertEquals(f(), 30);

  a(2);

  assertEquals(e(), 11);
  assertEquals(f(), 30);
});
