/**
 * Created by Xin on 12/05/2017.
 */

module.exports = class Stone {
  constructor({ color, size, lineWidth }) {
    this.size = size;
    this.radius = size / 2;
    this.lineWidth = lineWidth;
    this.color = color;
  }
}

