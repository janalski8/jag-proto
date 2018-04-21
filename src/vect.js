import PropTypes from "prop-types";

export class V4 {

  static zerovect = [0, 0, 0];
  static unitvect = [1, 1, 1];
  static posinfv = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
  static neginfv = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
  static vectx = [1, 0, 0];
  static vecty = [0, 1, 0];
  static vectz = [0, 0, 1];

  static add() {
    if (arguments.length === 0)
      return V4.zerovect;
    let v1 = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      const v2 = arguments[i];
      v1 = [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2]
      ]
    }
    return v1;
  }

  static sub(v1, v2) {
    return [
      v1[0] - v2[0],
      v1[1] - v2[1],
      v1[2] - v2[2]
    ]
  }

  static dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }
  static dotX(v1, v2) {
    return v1[1] * v2[1] + v1[2] * v2[2];
  }
  static dotY(v1, v2) {
    return v1[0] * v2[0] + v1[2] * v2[2];
  }
  static dotZ(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
  }

  static mul() {
    if (arguments.length === 0)
      return V4.unitvect;
    let v1 = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      const v2 = arguments[i];
      v1 = [
        v1[0] * v2[0],
        v1[1] * v2[1],
        v1[2] * v2[2]
      ]
    }
    return v1;
  }

  static max() {
    if (arguments.length === 0)
      return V4.neginfv;
    let v1 = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      const v2 = arguments[i];
      v1 = [
        Math.max(v1[0], v2[0]),
        Math.max(v1[1], v2[1]),
        Math.max(v1[2], v2[2])
      ]
    }
    return v1;
  }

  static min() {
    if (arguments.length === 0)
      return V4.posinfv;
    let v1 = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      const v2 = arguments[i];
      v1 = [
        Math.min(v1[0], v2[0]),
        Math.min(v1[1], v2[1]),
        Math.min(v1[2], v2[2])
      ]
    }
    return v1;
  }

  static norm(v) {
    return Math.sqrt(V4.dot(v, v));
  }
  static crossX(v1, v2) {
    return v1[1]*v2[2] - v1[2]*v2[1];
  }
  static crossY(v1, v2) {
    return v1[2]*v2[0] - v1[0]*v2[2];
  }
  static crossZ(v1, v2) {
    return v1[0]*v2[1] - v1[1]*v2[0];
  }
  static cross(v1, v2) {
    return V4.vect(V4.crossX(v1, v2), V4.crossY(v1, v2), V4.crossZ(v1, v2));
  }

  static scale(v, c) {
    return [
      v[0] * c,
      v[1] * c,
      v[2] * c
    ];
  }

  static normal(v, length = 1) {
    const norm = V4.norm(v);
    if (norm === 0)
      return v;
    return V4.scale(v, length / norm);
  }

  static affine(p1, a, p2) {
    return [
      p1[0] * (1-a) + p2[0] * a,
      p1[1] * (1-a) + p2[1] * a,
      p1[2] * (1-a) + p2[2] * a
    ];
  }

  static move(origin, direction, scale) {
    return V4.add(origin, V4.scale(direction, scale));
  }

  static dist(v1, v2) {
    return V4.norm(V4.sub(v2, v1));
  }

  static average() {
    if (arguments.length === 0)
      return V4.zerovect;
    return V4.scale(V4.add.apply(null, arguments), 1/arguments.length);
  }

  static rotZ(v, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [v[0] * cos - v[1] * sin, v[0] * sin + v[1] * cos, v[2]];
  }

  static angleZ(to, from) {
    return Math.atan2(V4.crossZ(from, to), V4.dotZ(from, to));
  }

  static vect(x, y, z=0) {
    return [x, y, z];
  }

}


export class M4 {
  constructor(values) {
    this.arr = values;
  }

  static flipX = [
    -1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
  static flipY = [
    1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
  static flipZ = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, -1, 0,
    0, 0, 0, 1,
  ];
  static id = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];

  static mulV(m, v) {
    return [
      v[0]* mget(m, 0, 0) + v[1]* mget(m, 0, 1) + v[2]* mget(m, 0, 2) + mget(m, 0, 3),
      v[0]* mget(m, 1, 0) + v[1]* mget(m, 1, 1) + v[2]* mget(m, 1, 2) + mget(m, 1, 3),
      v[0]* mget(m, 2, 0) + v[1]* mget(m, 2, 1) + v[2]* mget(m, 2, 2) + mget(m, 2, 3),
    ];
  }
  static mulM() {
    let m1 = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      const m2 = arguments[i];
      m1 = [
        mdot(m1, m2, 0, 0), mdot(m1, m2, 0, 1), mdot(m1, m2, 0, 2), mdot(m1, m2, 0, 3),
        mdot(m1, m2, 1, 0), mdot(m1, m2, 1, 1), mdot(m1, m2, 1, 2), mdot(m1, m2, 1, 3),
        mdot(m1, m2, 2, 0), mdot(m1, m2, 2, 1), mdot(m1, m2, 2, 2), mdot(m1, m2, 2, 3),
        mdot(m1, m2, 3, 0), mdot(m1, m2, 3, 1), mdot(m1, m2, 3, 2), mdot(m1, m2, 3, 3)
      ];
    }
    return m1;
  }

  static scaleS(s) {
    return [
      s, 0, 0, 0,
      0, s, 0, 0,
      0, 0, s, 0,
      0, 0, 0, 1
    ];
  }

  static scaleV(v) {
    return [
      v[0], 0, 0, 0,
      0, v[1], 0, 0,
      0, 0, v[2], 0,
      0, 0, 0, 1
    ]
  }

  static scaleVS(v, s) {
    s = s - 1;
    v = V4.normal(v);
    return [
      1+v[0]*v[0]*s,   v[0]*v[1]*s,   v[0]*v[2]*s, 0,
        v[1]*v[0]*s, 1+v[1]*v[1]*s,   v[1]*v[2]*s, 0,
        v[2]*v[0]*s,   v[2]*v[1]*s, 1+v[2]*v[2]*s, 0,
                0,           0,           0, 1
    ];
  }

  static rotZ(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      cos, -sin, 0, 0,
      sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  static rotX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      1, 0, 0, 0,
      0, cos, -sin, 0,
      0, sin, cos, 0,
      0, 0, 0, 1,
    ];
  }

  static rotY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      cos, 0, sin, 0,
      0, 0, 0, 0,
      -sin, 0, cos, 0,
      0, 0, 0, 1,
    ];
  }

  static flipV(v) {
    v = V4.normal(v);
    return [
      1-2*v[0]*v[0],  -2*v[0]*v[1],  -2*v[0]*v[2], 0,
       -2*v[1]*v[0], 1-2*v[1]*v[1],  -2*v[1]*v[2], 0,
       -2*v[2]*v[0],  -2*v[2]*v[1], 1-2*v[2]*v[2], 0,
                  0,             0,             0, 1
    ];
  }

  static moveFrom(v) {
    return [
      1, 0, 0, -v[0],
      0, 1, 0, -v[1],
      0, 0, 1, -v[2],
      0, 0, 0, 1
    ]
  }

  static moveTo(v) {
    return [
      1, 0, 0, v[0],
      0, 1, 0, v[1],
      0, 0, 1, v[2],
      0, 0, 0, 1
    ];
  }

  static translate(v) {
    return M4.moveTo(v);
  }
}

function mdot(m1, m2, x, y) {
  return (
    mget(m1, x, 0) * mget(m2, 0, y) +
    mget(m1, x, 1) * mget(m2, 1, y) +
    mget(m1, x, 2) * mget(m2, 2, y) +
    mget(m1, x, 3) * mget(m2, 3, y)
  );
}
function mget(matrix, x, y) {
  return matrix[x*4 + y];
}
