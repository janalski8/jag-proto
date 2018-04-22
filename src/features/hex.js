import {V4} from "../utils/vect";

const s = Math.sqrt(3) / 2;
export const projM = [
  s, -s, 0, 0,
  1 / 2, 1 / 2, -1, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
];
export const dirs = {
  l: [-1, 1, 0],
  r: [1, -1, 0],
  ru: [1, 0, -1],
  lu: [0, 1, -1],
  ld: [-1, 0, 1],
  rd: [0, -1, 1],
};

export function key(v) {
  return `${v[0]} ${v[1]} ${v[2]}`;
}

export function dist(p1, p2) {
  return V4.abs(V4.sub(p1, p2))/2;
}