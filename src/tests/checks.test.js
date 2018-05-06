//example usage
//commented examples would cause exceptions;
import {
  all,
  any, array_len, array_of, bool, check,
  geq, greater, integer,
  is,
  is_array,
  is_in,
  is_object, leq, lower,
  maybe,
  nully, number,
  obj_size,
  object,
  positive, string,
  tuple, values
} from "../utils/checks";

it("checks for type correctness", () => {
  expect(() => check(string, "a")).not.toThrow();
  expect(() => check(number, -9.2)).not.toThrow();
  expect(() => check(bool, false)).not.toThrow();
  expect(() => check(positive, 4.5)).not.toThrow();
  expect(() => check(integer, 2)).not.toThrow();
  expect(() => check(nully, null)).not.toThrow();
  expect(() => check(nully, undefined)).not.toThrow();
});

it("fails in case of wrong type", () => {
  expect(() => check(string, 29)).toThrow();
  expect(() => check(number, "131")).toThrow();
  expect(() => check(number, 1/0)).toThrow();
  expect(() => check(number, 0/0)).toThrow();
  expect(() => check(bool, null)).toThrow();
  expect(() => check(positive, -3)).toThrow();
  expect(() => check(integer, 2.2)).toThrow();
  expect(() => check(nully, "null")).toThrow();
  expect(() => check(nully, 0)).toThrow();
});

it("checks whether value satisfies any of the tests", () => {
  expect(() => check(any(string, integer), "asda")).not.toThrow();
  expect(() => check(any(string, integer), 1)).not.toThrow();
  expect(() => check(any(string, integer), false)).toThrow();
});

it("checks whether value satisfies any of the tests", () => {
  expect(() => check(any(string, integer), "asda")).not.toThrow();
  expect(() => check(any(string, integer), 1)).not.toThrow();
  expect(() => check(any(string, integer), false)).toThrow();
});

it("checks whether value satisfies any predicate", () => {
  expect(() => check(all(positive, integer), 2)).not.toThrow();
  expect(() => check(all(positive, integer), -2)).toThrow();
  expect(() => check(all(positive, integer), 2.2)).toThrow();
});

it("checks if value satisfies all predicates", () => {
  expect(() => check(all(positive, integer), 2)).not.toThrow();
  expect(() => check(all(positive, integer), -2)).toThrow();
  expect(() => check(all(positive, integer), 2.2)).toThrow();
});

it("checks if value satisfies all predicates", () => {
  expect(() => check(geq(3), 2)).toThrow();
  expect(() => check(geq(3), 3)).not.toThrow();
  expect(() => check(geq(3), 4)).not.toThrow();
  expect(() => check(leq(3), 2)).not.toThrow();
  expect(() => check(leq(3), 3)).not.toThrow();
  expect(() => check(leq(3), 4)).toThrow();
  expect(() => check(lower(3), 2)).not.toThrow();
  expect(() => check(lower(3), 3)).toThrow();
  expect(() => check(lower(3), 4)).toThrow();
  expect(() => check(greater(3), 2)).toThrow();
  expect(() => check(greater(3), 3)).toThrow();
  expect(() => check(greater(3), 4)).not.toThrow();
});

it("check if value is null, undefined or satisfies predicate", () => {
  expect(() => check(maybe(positive), 2)).not.toThrow();
  expect(() => check(maybe(positive), -2)).toThrow();
  expect(() => check(maybe(positive), null)).not.toThrow();
  expect(() => check(maybe(positive), undefined)).not.toThrow();
});

it("examples of composite rintime check", () => {
  check(object({
    any_array: is_array,
    any_object: is_object,
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
});
