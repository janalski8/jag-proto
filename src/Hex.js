import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {V4} from "./vect";

class Hex extends Component {
  render() {
    let center = this.props.center;
    let arm = [0, this.props.radius, 0];
    let points = [];
    for (let i = 0; i < 6; i++) {
      points.push(V4.add(center, arm));
      arm = V4.rotZ(arm, Math.PI/3.0);
    }
    return (
      <polygon
        points={points.map(Hex.format).join(" ")}
        fill={this.props.fill}
        stroke="black"
        strokeWidth={5}
        strokeLinejoin="round"
        onClick={() => this.props.onPress(this.props.idx)}
      />
    )
  }
  static format(point) {
    return `${point[0]},${point[1]}`;
  }
}

Hex.propTypes = {};
Hex.defaultProps = {};

export default Hex;
