/**
 * Created by Xin on 11/05/2017.
 */

class View {
  constructor() {
    this.eventHub = new EventHub();
    this.canvas = document.getElementById("goBoard");
    this.ctx = this.canvas.getContext("2d");
    this.board = new GoBoard({
      boardBackgroundColor: Constants.BOARD_BACKGROUND_COLOR,
      boardLineColor: Constants.BOARD_LINE_COLOR,
      boardLineWith: Constants.BOARD_LINE_WIDTH,
      cellSize: Constants.CELL_SIZE,
      circleStoneColor: Constants.CIRCLE_STONE_COLOR,
      crossStoneColor: Constants.CROSS_STONE_COLOR,
      ctx: this.ctx,
      size: Constants.SIZE,
      stoneLineWidth: Constants.STONE_LINE_WITH,
      stoneSize: Constants.STONE_SIZE,
    });
    this.newRoundBtn = document.querySelector('.button.newRound');
    this.undoBtn = document.querySelector('.button.undo');
    this.redoBtn = document.querySelector('.button.redo');
  }

  init() {
    this.board.drawBoard();
    this.board.addCellClickListener(this.handleBoardClick.bind(this));
    this.newRoundBtn.onclick = this.handleNewRoundBtnClick.bind(this);
    this.undoBtn.onclick = this.handleUndoBtnClick.bind(this);
    this.redoBtn.onclick = this.handleRedoBtnClick.bind(this);
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

  addNewRoundClickListener(listener) {
    console.log('new_round_click');
    this.eventHub.on('new_round_click', listener);
  }

  handleNewRoundBtnClick() {
    console.log('new_round_click');
    this.eventHub.emit('new_round_click');
  }

  addUndoBtnClickListener(listener) {
    this.eventHub.on('undo_click', listener);
  }

  handleUndoBtnClick() {
    this.eventHub.emit('undo_click');
  }

  addRedoBtnClickListener(listener) {
    this.eventHub.on('redo_click', listener);
  }

  handleRedoBtnClick() {
    this.eventHub.emit('redo_click');
  }
}