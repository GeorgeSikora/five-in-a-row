/**
 * Created by Xin on 11/05/2017.
 */

 const Constants = require('./Constants');
 const EventHub = require('./EventHub');
 const GoBoard = require('./components/GoBoard');

 module.exports = class View {
  constructor() {
    this.eventHub = new EventHub();
    this.board = new GoBoard({
      boardBackgroundColor: Constants.BOARD_BACKGROUND_COLOR,
      boardLineColor: Constants.BOARD_LINE_COLOR,
      boardLineWith: Constants.BOARD_LINE_WIDTH,
      cellSize: Constants.CELL_SIZE,
      circleStoneColor: Constants.CIRCLE_STONE_COLOR,
      crossStoneColor: Constants.CROSS_STONE_COLOR,
      size: Constants.SIZE,
      stoneLineWidth: Constants.STONE_LINE_WITH,
      stoneSize: Constants.STONE_SIZE,
    });
  }

  init() {
    this.board.drawBoard();
    this.board.addCellClickListener(this.handleBoardClick.bind(this));
  }

  newRound() {
    const { board } = this;
    board.drawBoard();
  }

  addStone(column, row, type) {
    this.board.addStone(column, row, type);
  }

  notifyWin(playerId, sameRowStones) {
    let { row: row1, column: column1 } = sameRowStones[0];
    let { row: row2, column: column2 } = sameRowStones[sameRowStones.length - 1];
    this.board.drawCrossLine(row1, column1, row2, column2);
  }

  undo(column, row) {
    this.board.removeStone(column, row);
  }

  removeCrossLine(sameRowPoints, stoneType) {
    this.board.removeCrossLine(sameRowPoints, stoneType);
  }

  addBoardClickListener(listener) {
    this.eventHub.on('board_click', listener);
  }

  handleBoardClick(column, row) {
    const { eventHub, canvas, board } = this;

    console.log('board_click');

    eventHub.emit('board_click', column, row);
  }
}