import {M4, V4} from "../vect";

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


export function make_grid(size) {
  let hexes = [];
  let center = [0,0,0];
  for (let row = -size; row <= size; row++) {
    let base = V4.move(center, dirs.r, row);
    for (let i = -size; i <= size; i++)
      hexes.push(V4.move(base, dirs.lu, i));
  }
  return hexes;
}