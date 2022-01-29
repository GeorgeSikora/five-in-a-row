/**
 * Created by Xin on 12/05/2017.
 */
const EventHub = require('../EventHub');
const Point = require('./Point');

module.exports = class ControllerBoard {
  constructor(size) {
    this.eventHub = new EventHub();
    this.size = size;
    this.points = null;
    this.pointStack = [];
    this.undoPointStack = [];
    this.currentPlayer = null;
    this.isPlaying = false;
    this.players = [];
    this.sameRowPoints = [];
    this.winner = null;
  }

  newRound() {
    this.players.forEach((player) => {
      player.removeMovedListener(this.handleMoved);
    });
    this.points = [];

    for (let i = 0; i < this.size; i++) {
      this.points[i] = new Array(this.size);
      for (let j = 0; j < this.size; j++) {
        this.points[i][j] = ' ';
      }
    }

    this.pointStack = [];
    this.undoPointStack = [];
    this.currentPlayer = null;
    this.isPlaying = true;
    this.players = [];
    this.sameRowPoints = [];
    this.winner = null;
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getPlayer(playerId) {
    return this.players.find(player => player.id === playerId);
  }

  hasWinner() {
    return this.winner !== null;
  }

  getWinner() {
    return this.winner;
  }

  getSameRowPoints() {
    return this.sameRowPoints;
  }

  addPlayer(player) {
    this.players.push(player);
    player.addMovedListener(this.handleMoved.bind(this));
  }

  whoseTurn() {
    return this.currentPlayer;
  }

  isMoveAvailable(column, row) {
    /* check whether existed already */
    return this.points[row][column] === ' ';
  }

  /**
   * directions:
   *  - :
   *    rowStep: 0
   *    columnStep: 1
   *  | :
   *    rowStep: 1
   *    columnStep: 0
   *  \ :
   *    rowStep: 1
   *    columnStep: 1
   *  / :
   *    rowStep: -1
   *    columnStep: 1
   *
   * @param points
   * @param point
   * @param rowStep
   * @param columnStep
   * @returns {Array}
   */
  searchSameRowPoints(point, rowStep, columnStep) {
    let { row, column, playerId } = point;
    let sameRowPoints = [point];

    for (let i = 1; i <= 4; i++) {
      let currentRow = row - rowStep * i;
      let currentColumn = column - columnStep * i;

      if (this.points[currentRow] && this.points[currentRow][currentColumn] === playerId) {
        const targetPoint = new Point(currentRow, currentColumn, playerId);
        sameRowPoints.unshift(targetPoint);
      } else {
        break;
      }
    }

    for (let i = 1; i <= 4; i++) {
      let currentRow = row + rowStep * i;
      let currentColumn = column + columnStep * i;
      if (this.points[currentRow] && this.points[currentRow][currentColumn] === playerId) {
        const targetPoint = new Point(currentRow, currentColumn, playerId);
        sameRowPoints.push(targetPoint);
      } else {
        break;
      }
    }

    return sameRowPoints;
  }

  searchConnectFive(point) {

    //  direction: -
    let sameRowPoints = this.searchSameRowPoints(point, 0, 1);
    //  direction: |
    if (sameRowPoints.length < 5) {
      sameRowPoints = this.searchSameRowPoints(point, 1, 0);
    }
    //  direction: \
    if (sameRowPoints.length < 5) {
      sameRowPoints = this.searchSameRowPoints(point, 1, 1);
    }
    //  direction: /
    if (sameRowPoints.length < 5) {
      sameRowPoints = this.searchSameRowPoints(point, -1, 1);
    }

    return sameRowPoints.length >= 5 ? sameRowPoints : null;
  }

  notifyWin(playerId, sameRowPoints) {
    this.isPlaying = false;
    this.winner = this.players.find(player => player.id === playerId);
    this.sameRowPoints = sameRowPoints;
    this.eventHub.emit('notify_win', playerId, sameRowPoints);
  }

  addPoint(point) {
    const { column, row, playerId } = point;
    this.points[row] = this.points[row] || [];
    this.points[row][column] = playerId;
    this.eventHub.emit('point_add', point);
  }

  removePoint(point) {
    this.points[point.row][point.column] = ' ';
    this.eventHub.emit('point_remove', point);
  }

  evaluate(point) {
    const { column, row, playerId } = point;
    const sameRowPoints = this.searchConnectFive(point);

    if (sameRowPoints) {
      this.notifyWin(playerId, sameRowPoints);
    }
  }

  processMoved(point) {
    this.evaluate(point);
    this.addPoint(point);
  }

  stackPoint(point) {
    this.pointStack.push(point);
    this.undoPointStack = [];
  }

  undo() {
    const { pointStack, undoPointStack, players, points, sameRowPoints, winner, isPlaying, eventHub } = this;
    const point = pointStack.pop();
    if (point) {
      undoPointStack.push(point);

      const player = players.find(player => player.id === point.playerId);
      this.setCurrentPlayer(player);
      this.removePoint(point);

      if (!isPlaying) {
        this.isPlaying = true;
      }

      if (this.hasWinner()) {
        this.winner = null;
        this.sameRowPoints = [];
      }
    }
  }


  redo() {
    const { pointStack, undoPointStack, players, points, sameRowPoints, winner, isPlaying, eventHub } = this;
    const point = undoPointStack.pop();
    if (point) {
      pointStack.push(point);
      const player = this.getPlayer(point.playerId);
      this.setCurrentPlayer(player);
      this.processMoved(point);
    }
  }

  handleMoved(point) {
    const { currentPlayer, eventHub } = this;
    const { column, row, playerId } = point;
    if (this.isPlaying && currentPlayer.id === playerId && this.isMoveAvailable(column, row)) {
      this.stackPoint(point);
      this.processMoved(point);
    }
  }

  addMovedListener(listener) {
    this.eventHub.on('point_add', listener);
  }

  addWinNotifiedListener(listener) {
    this.eventHub.on('notify_win', listener);
  }

  addPointRemovedListener(listener) {
    this.eventHub.on('point_remove', listener);
  }

}