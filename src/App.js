import React, {Component} from 'react';
import './styles/App.css';
import Hex from "./Hex";
import {M4, V4} from "./utils/vect";
import {connect} from "react-redux";
import {HEX_PRESS} from "./features/main";
import {key, projM} from "./features/hex";


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
          hexes.map(hex => {
            let k = key(hex.coords);
            let fill = "gray";
            if (k === this.props.selected)
              fill = "red";
            else if (hex.unit_idx != null)
              fill = this.props.units[hex.unit_idx].unit.color;
            return (<Hex
                fill={fill}
                center={M4.mulV(m, hex.coords)}
                idx={key(hex.coords)}
                radius={100}
                point={hex.coords}
                onPress={this.props.onHexPress}
              />);
            }
          )
        }
      </svg>
      </div>
    );
  }
}

export const BoundApp = connect(mapState, mapDispatch)(App);
