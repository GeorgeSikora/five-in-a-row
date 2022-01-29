/**
 * Created by Xin on 12/05/2017.
 */

const EventHub = require('../EventHub');
const Point = require('./Point');

 module.exports = class Player {
  constructor({ id }) {
    this.id = id;
    this.eventHub = new EventHub();
  }

  setStoneType(type) {
    this.stoneType = type;
  }

  getStoneType() {
    return this.stoneType;
  }

  move(column, row) {
    const point = new Point(row, column, this.id);
    this.eventHub.emit('moved', point);
  }

  addMovedListener(listener) {
    this.eventHub.on('moved', listener);
  }

  removeMovedListener(listener) {
    this.eventHub.removeListener('moved', listener);
  }

}