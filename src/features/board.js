import {M4, V4} from "../utils/vect";
import {dirs, key} from "./hex";
import {shuffle} from "../utils/collections";

export function add_hex(state, cube_coords) {
  let hexes = {...state};
  hexes[key(cube_coords)] = {coords: cube_coords};
  return hexes;
}

export function add_unit(state, coords_idx, unit) {
  let idx = state.next_idx.toString();
  let units = {...state.units};
  units[idx] = {unit, idx};

  let hexes = {...state.hexes};
  let hex = hexes[coords_idx];
  if (hex.unit_idx != null)
    throw Error("hex occupied");
  hex = {...hex, unit_idx: idx};
  hexes[coords_idx] = hex;
  return {...state, units, hexes, next_idx: state.next_idx + 1};
}

export function make_grid(size) {
  let hexes = {};
  let center = [0,0,0];
  for (let row = -size; row <= size; row++) {
    let base = V4.move(center, dirs.r, row);
    for (let i = -size; i <= size; i++)
      hexes = add_hex(hexes, V4.move(base, dirs.lu, i));
  }
  return hexes;
}

export function add_units(state, count, unit) {
  for (let i = 0; i < count; i++) {
    let free = Object.values(state.hexes).filter(hex => hex.unit_idx == null);
    shuffle(free);
    state = add_unit(state, key(free[0].coords), unit);
  }
  return state;
}
