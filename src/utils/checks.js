function errmsg(value) {
  let result = JSON.stringify(value, (k, v) => v === undefined ? "undefined" : v);
  if (result.length > 128)
    return result.slice(0, 128) + "...";
  else
    return result;
}

function simple_info(predicate, value) {
  return `${errmsg(value)} is not ${predicate.name}`;
}

function condition_info(condition, value, threshold) {
  return `${errmsg(value)} is not ${condition} than ${threshold}`;
}

export function nully(value) {
  if (value == null)
    return null;
  else
    return simple_info(nully, value);
}

export function bool(value) {
  if (typeof value === "boolean")
    return null;
  else
    return simple_info(bool, value)
}

export function string(value) {
  if (typeof value === "string")
    return null;
  else
    return simple_info(string, value)
}

export function number(value) {
  if (Number.isFinite(value))
    return null;
  else
    return simple_info(number, value);
}

export function is_object(value) {
  if (typeof value === "object")
    return null;
  else
    return `${errmsg(value)} is not an object`;
}

export function is_array(value) {
  if (Array.isArray(value))
    return null;
  else
    return `${errmsg(value)} is not an array`;
}

export function integer(value) {
  if (Number.isSafeInteger(value))
    return null;
  else
    return simple_info(integer, value);
}

export function positive(value) {
  if (number(value) != null)
    return number(value);
  if (!(value > 0))
    return simple_info(positive, value);
  return null;
}

export function nonnegative(value) {
  if (number(value) != null)
    return number(value);
  if (!(value >= 0))
    return simple_info(nonnegative, value);
  return null;
}

export function lower(threshold) {
  check(number, threshold);
  return function(value) {
    if (number(value) != null)
      return number(value);
    if (!(value < threshold))
      return condition_info("lower", value, threshold);
    return null;
  };
}

export function greater(threshold) {
  check(number, threshold);
  return function(value) {
    if (number(value) != null)
      return number(value);
    if (!(value > threshold))
      return condition_info("greater", value, threshold);
    return null;
  };
}

export function leq(threshold) {
  check(number, threshold);
  return function(value) {
    if (number(value) != null)
      return number(value);
    if (!(value <= threshold))
      return condition_info("equal or lower", value, threshold);
    return null;
  };
}

export function geq(threshold) {
  check(number, threshold);
  return function(value) {
    if (number(value) != null)
      return number(value);
    if (!(value >= threshold))
      return condition_info("equal or greater", value, threshold);
    return null;
  };
}

export function all() {
  const predicates = arguments;
  return function(value) {
    for (const predicate of predicates) {
      let result = predicate(value);
      if (result != null)
        return result;
    }
    return null;
  };
}

export function any() {
  const predicates = arguments;
  return function(value) {
    if (predicates.length === 0)
      return "no arguments - any() always fails";
    const errs = [];
    for (const predicate of predicates) {
      let result = predicate(value);
      if (result == null)
        return null;
      else
        errs.push(result);
    }
    return errs.join(" and ");
  };
}

export function maybe(test) {
  return any(nully, test);
}

export function is(test_value) {
  return function (value) {
    if (test_value === value)
      return null;
    return `${errmsg(value)} is not ${errmsg(test_value)}`;
  };
}

export function is_in() {
  const values_set = new Set(arguments);
  return function(value) {
    if (values_set.size === 0)
      return "no arguments - is_in() always fails";
    if (values_set.has(value))
      return null;
    else
      return `${errmsg(value)} isn't equal to any of the values: ${errmsg([...values_set])}`;
  };
}

export function object_size(size) {
  check(all(nonnegative, integer), size);

  return function(value) {
    if (is_object(value) != null)
      return is_object(value);
    let actual_size = Object.keys(value).length;
    if (size !== actual_size)
      return `${errmsg(value)} has wrong size: ${actual_size}, should be: ${size}`;
    return null;
  };
}

export function object(shape) {
  check(is_object, shape);

  return function(value) {
    if (is_object(value) != null)
      return is_object(value);
    for (const [key, predicate] of Object.entries(shape)) {
      let result = predicate(value[key]);
      if (result != null)
        return `{${key}: ${result}}`;
    }
    return null;
  };
}

export function object_strict(shape) {
  return all(object_size(Object.keys(shape).length), object(shape));
}

export function values(test) {
  return function(obj) {
    if (is_object(obj) != null)
      return is_object(obj);
    for (const [key, value] of Object.entries(obj)) {
      let result = test(value);
      if (result != null)
        return `{${key}: ${result}}`;
    }
    return null;
  };
}

export function array_len(count) {
  return function(arr) {
    if (is_array(arr) != null)
      return is_array(arr);
    let actual_length = arr.length;
    if (actual_length !== count)
      return `${errmsg(arr)} has wrong length: ${actual_length}, should be: ${count}`;
    return null;
  };
}

export function tuple() {
  const tests_array = Array.prototype.slice.call(arguments);
  const initial_test = array_len(tests_array.length);
  return function(value) {
    if (initial_test(value) != null)
      return initial_test(value);
    for (let i = 0; i < tests_array.length; i++) {
      let test = tests_array[i];
      let result = test(value[i]);
      if (result != null)
        return `[${i}: ${result}]`;
    }
    return null;
  };
}

export function array_of(test) {
  return function(value) {
    if (is_array(value) != null)
      return is_array(value);
    for (let i = 0; i < value.length; i++) {
      let result = test(value[i]);
      if (result != null)
        return `[${i}: ${result}]`;
    }
    return null;
  };
}


export function check(test, value) {
  let result = test(value);
  if (result != null)
    throw Error(result);
  return value;
}
