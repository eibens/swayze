/** HELPERS **/

type Sub = () => void;

function createSubs() {
  const subs: (() => void)[] = [];
  return {
    sub: (f: Sub) => {
      subs.push(f);
    },
    pub: () => {
      subs.forEach((f) => f());
    },
  };
}

function wrapDeps<T extends [...unknown[]]>(deps: Deps<T>, f: Sub) {
  deps.forEach((dep) => {
    dep.sub(() => f());
  });
  return {
    get: (): T => {
      return deps.map((d) => d.get()) as T;
    },
  };
}

/** MAIN **/

export type Dep<T> = {
  get: () => T;
  sub: (f: () => void) => void;
};

export type Arg<T> = Dep<T> & {
  set: (value: T) => void;
};

export type Deps<T extends [...unknown[]]> = {
  [i in keyof T]: Dep<T[i]>;
};

export function fun<Y, X extends [...unknown[]]>(
  f: (...x: X) => Y,
  ...deps: Deps<X>
): Dep<Y> {
  let dirty = false;
  let value: Y | undefined;
  let initial = true;

  const { sub, pub } = createSubs();

  const { get } = wrapDeps(deps, () => {
    dirty = true;
    pub();
  });

  return {
    sub,
    get: () => {
      if (!dirty && !initial) return value!;
      value = f(...get());
      initial = false;
      dirty = false;
      return value;
    },
  };
}

export function arg<T>(
  initial: T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b,
): Arg<T> {
  let value = initial;
  const { sub, pub } = createSubs();
  return {
    sub,
    get: () => value,
    set: (newValue) => {
      if (equals(value, newValue)) return;
      value = newValue;
      pub();
    },
  };
}
