/**
 * Created by Xin on 20/05/2017.
 */

class Point {
  constructor(row, column, playerId) {
    this.column = column;
    this.row = row;
    this.playerId = playerId;
  }
}

Point.X = 'x';
Point.O = 'o';
Point.EMPTY = ' ';

module.exports = Point;