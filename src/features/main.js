import {make_grid} from "./grid";

export const HEX_PRESS = "HEX_PRESS";

function initial_state() {
  let hexes = {};
  make_grid(5).forEach((p, i) => hexes[i.toString()] = {point: p, idx: i.toString()});
  return {
    hexes,
    selected: null
  }
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