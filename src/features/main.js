import {add_units, make_grid} from "./board";

export const HEX_PRESS = "HEX_PRESS";

function initial_state() {
  let hexes = make_grid(5);
  let state = {
    hexes,
    next_idx: 0,
    selected: null,
    units: {},
    queue: []
  };
  state = add_units(state, 5, "blue");
  state = add_units(state, 5, "green");
  return state;
}

export function main(state = initial_state(), action) {
  switch (action.type) {
    case HEX_PRESS:
      if (state.selected !== action.idx)
        return {...state, selected: action.idx};
      else
        return {...state, selected: null};
    default:
      return state;
  }
}