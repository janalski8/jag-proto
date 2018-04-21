import React, {Component} from 'react';
import './styles/App.css';
import Hex from "./Hex";
import {M4, V4} from "./vect";
import {connect} from "react-redux";
import {HEX_PRESS} from "./features/main";
import {projM} from "./features/grid";


function mapState(state) {
  return state;
}
function mapDispatch(dispatch) {
  return {
    onHexPress: (idx) => {
      dispatch({
        type: HEX_PRESS,
        idx
      });
    }
  }
}

class App extends Component {
  render() {
    let hexes = Object.values(this.props.hexes);
    let m = M4.mulM(M4.scaleS(100), projM);
    return (
      <div>
      <svg style={{height: "100vh", width: "100vw"}} viewBox={"-1000 -1000 2000 2000"}>
        {
          hexes.map(hex =>
            <Hex
              fill={hex.idx === this.props.selected ? "red": "gray"}
              center={M4.mulV(m, hex.point)}
              radius={100}
              point={hex.point}
              idx={hex.idx}
              onPress={this.props.onHexPress}
            />
          )
        }
      </svg>
      </div>
    );
  }
}

export const BoundApp = connect(mapState, mapDispatch)(App);
