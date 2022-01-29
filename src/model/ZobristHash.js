/**
 * Created by Xin on 05/06/2017.
 */

const Point = require('./Point');

module.exports = class ZobristHash {

  constructor(size) {
    this.size = size;
    this.zobristKey = [];
    this.initZobristKey();
  }

  initZobristKey() {
    const { zobristKey, size } = this;
    for (let i = 0; i < size; i++) {
      zobristKey[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        zobristKey[i][j] = new Array(size);
        for (let k = 0; k < 2; k++) {
          // zobristKey[i][j][k] = (1 + Math.random() * 0xFFFFFFFF) >>> 0;
          zobristKey[i][j][k] = Math.floor(Math.random() * 1000000000);
          // zobristKey[i][j][k] = Math.random() * 4294967296;
        }
      }
    }
  }

  hash(points) {
    const { zobristKey } = this;
    let hash = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[i].length; j++) {
        if (points[i][j] !== Point.EMPTY) {
          const index = points[i][j] === Point.O ? 0 : 1;
          hash ^= zobristKey[i][j][index];
        }
      }
    }
    return hash;
  }

}