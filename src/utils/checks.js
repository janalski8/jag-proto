function errmsg(x) {
  let result = JSON.stringify(x, (k, v) => v === undefined ? "undefined" : v);
  if (result.length > 128)
    return result.slice(0, 128) + "...";
  else
    return result;
}

function simpleInfo(f) {
  return function(x) {
    if (f(x))
      return null;
    return `${errmsg(x)} is not ${f.name}`;
  };
}
function condInfo(f, cond, val) {
  return function(x) {
    if (f(x))
      return null;
    return `${errmsg(x)} is not ${cond} than ${val}`;
  };
}

export function nully(x) {
  return x == null;
}
nully.info = simpleInfo(nully);

export function bool(x) {
  return typeof x === "boolean";
}
bool.info = simpleInfo(bool);

export function string(x) {
  return typeof x === "string";
}
string.info = simpleInfo(string);

export function number(x) {
  return Number.isFinite(x);
}
number.info = simpleInfo(number);

export function positive(x) {
  return number(x) && x > 0;
}
positive.info = simpleInfo(positive);

export function integer(x) {
  return Number.isSafeInteger(x);
}
integer.info = simpleInfo(integer);

export function lower(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x < val;
  };
  r.info = condInfo(r, "lower", val);
  return r;
}

export function greater(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x > val;
  };
  r.info = condInfo(r, "greater", val);
  return r;
}

export function leq(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x <= val;
  };
  r.info = condInfo(r, "equal or lower", val);
  return r;
}

export function geq(val) {
  check(number, val);
  const r = function(x) {
    return number(x) && x >= val;
  };
  r.info = condInfo(r, "equal or greater", val);
  return r;
}

export function all() {
  const args = arguments;
  const r = function(value) {
    for (const arg of args)
      if (!arg(value))
        return false;
    return true;
  };
  r.info = function(value) {
    for (const arg of args)
      if (!arg(value))
        return arg.info(value);
    return null;
  };
  return r;
}

export function any() {
  const args = arguments;
  const r = function(value) {
    for (const arg of args)
      if (arg(value))
        return true;
    return false;
  };
  r.info = function(value) {
    if (args.length === 0)
      return "no arguments - any() always fails";
    const errs = [];
    for (const arg of args)
      if (arg(value))
        return null;
      else
        errs.push(arg.info(value));
    return errs.join(" and ");
  };
  return r;
}

export function maybe(test) {
  return any(nully, test);
}

export function is(val) {
  const r = function(other) {
    return val === other;
  };
  r.info = function (x) {
    if (r(x))
      return null;
    return `${errmsg(x)} is not ${val}`;
  };
  return r;
}

export function is_in() {
  const argset = new Set(arguments);
  const r = function(value) {
    return argset.has(value);
  };
  r.info = function(value) {
    if (argset.size === 0)
      return "no arguments - isin() always fails";
    if (argset.has(value))
      return null;
    else
      return `${errmsg(value)} isn't equal to any of the values: ${errmsg([...argset])}`;
  };
  return r;
}

export function object(object) {
  const r = function(x) {
    if (typeof x !== "object")
      return false;
    for (const [key, test] of Object.entries(object))
      if (!test(x[key]))
        return false;
    return true;
  };
  r.info = function(x) {
    if (typeof x !== "object")
      return `${errmsg(x)} is not an object`;
    for (const [key, test] of Object.entries(object))
      if (!test(x[key]))
        return `{${key}: ${test.info(x[key])}}`;
    return null;
  };
  return r;
}

export function obj_size(size) {
  const r = function(x) {
    if (typeof x !== "object")
      return false;
    return size === Object.entries(x).length;
  };
  r.info = function(x) {
    if (typeof x !== "object")
      return `${errmsg(x)} is not an object`;
    if (size !== Object.entries(x).length)
      return `${errmsg(x)} has wrong length: ${Object.entries(x).length}, should be: ${size}`;
    return null;
  };
  return r;
}

export function obj_strict(shape) {
  return all(obj_size(Object.keys(shape).length), object(shape));
}

export function values(test) {
  const r = function(x) {
    if (typeof x !== "object")
      return false;
    for (const val of Object.values(x))
      if (!test(val))
        return false;
    return true;
  };
  r.info = function(x) {
    if (typeof x !== "object")
      return `${errmsg(x)} is not an object`;
    for (const [key, val] of Object.entries(x))
      if (!test(val))
        return `{${key}: ${test.info(val)}}`;
    return null;
  };
  return r;
}

export function is_object() {  const r = function(x) {
  return typeof x === "object";

};
  r.info = function(x) {
    if (typeof x !== "object")
      return `${errmsg(x)} is not an object`;
    return true;
  };
  return r;
}

export function tuple() {
  const testarr = Array.prototype.slice.call(arguments);
  const r = function(x) {
    if (!Array.isArray(x))
      return false;
    if (x.length !== testarr.length)
      return false;
    for (let i = 0; i < testarr.length; i++)
      if (!testarr[i](x[i]))
        return false;
    return true;
  };
  r.info = function(x) {
    if (!Array.isArray(x))
      return `${errmsg(x)} is not an array`;
    if (x.length !== testarr.length)
      return `${errmsg(x)} has wrong length: ${x.length}, should be: ${testarr.length}`;
    let idx = 0;
    for (let i = 0; i < testarr.length; i++)
      if (!testarr[i](x[i]))
        return `{${idx}: ${testarr[i].info(x[i])}}`;
    return null;
  };
  return r;
}

export function array_len(count) {
  const r = function(x) {
    if (!Array.isArray(x))
      return false;
    return x.length === count;

  };
  r.info = function(x) {
    if (!Array.isArray(x))
      return `${errmsg(x)} is not an array`;
    if (x.length !== count)
      return `${errmsg(x)} has wrong length: ${x.length}, should be: ${count}`;
    return null;
  };
  return r;
}

export function array_of(test) {
  const r = function(x) {
    if (!Array.isArray(x))
      return false;
    for (const val of x)
      if (!test(val))
        return false;
    return true;
  };
  r.info = function(x) {
    if (!Array.isArray(x))
      return `${errmsg(x)} is not an array`;
    let idx = 0;
    for (const val of x) {
      if (!test(val))
        return `{${idx}: ${test.info(val)}}`;
      idx += 1;
    }
    return null;
  };
  return r;
}

export function is_array(test) {
  const r = function(x) {
    return Array.isArray(x);

  };
  r.info = function(x) {
    if (!Array.isArray(x))
      return `${errmsg(x)} is not an array`;
    return null;
  };
  return r;
}

export function check(test, value) {
  if (!test(value)) {
    console.log(value);
    throw Error(test.info(value));
  }
  return value;
}

//example usage
//commented examples would cause exceptions;
check(string, "a");
check(number, -9.2);
check(bool, false);
check(positive, 4.5);
check(integer, 2);
check(nully, null);
check(nully, undefined);
//check(string, 29);
//check(number, "131");
//check(number, 1/0);
//check(number, 0/0);
//check(bool, null);
//check(positive, -3);
//check(integer, 2.2);
//check(nully, "null");
//check(nully, 0);
check(any(string, integer), "asda");
check(any(string, integer), 1);
//check(any(string, integer), false);
check(all(positive, integer), 2);
//check(all(positive, integer), -2);
//check(all(positive, integer), 2.2);
//check(geq(3), 2);
check(geq(3), 3);
check(geq(3), 4);
check(leq(3), 2);
check(leq(3), 3);
//check(leq(3), 4);
check(lower(3), 2);
//check(lower(3), 3);
//check(lower(3), 4);
//check(greater(3), 2);
//check(greater(3), 3);
check(greater(3), 4);
check(maybe(positive), 2);
//check(maybe(positive), -2);
check(maybe(positive), null);
check(maybe(positive), undefined);

check(object({
  any_array: is_array(),
  any_object: is_object(),
  some_string: string,
  point_3d: tuple(number, number, number),
  list_of_enums: array_of(is_in("a", "b", "c")),
  exact_value: is("value"),
  obj_with_values: values(number),
  sized_array: array_len(10),
  sized_object: obj_size(5),
}), {
  any_array: [null, 2, "what", undefined, function() {}],
  any_object: {a: null, b: "whatever", c: 2, d: function() {}},
  some_string: "blabla",
  point_3d: [1, 2, 3],
  list_of_enums: ["a", "a", "b", "c", "c"],
  exact_value: "value",
  obj_with_values: {a: 2, b: 6, c: -121.2},
  sized_array: [0, 1, 2, 3, 4, null, undefined, "blabla", 8, 9],
  sized_object: {x0: 1, x1: null, x2: undefined, x3: "blabla", x4: function() {}},
  other: "hello", //would not work with obj_strict because of this entry
});