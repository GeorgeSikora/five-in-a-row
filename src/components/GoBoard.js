/**
 * Created by Xin on 12/05/2017.
 */

 const EventHub = require('../EventHub');
 const CircleStone = require('./CircleStone');
 const CrossStone = require('./CrossStone');
 const Stone = require('./Stone');

 module.exports = class GoBoard {
  constructor({ boardBackgroundColor, boardLineColor, boardLineWith, cellSize, circleStoneColor, crossStoneColor, size, stoneLineWidth, stoneSize, }) {
    this.eventHub = new EventHub();
    this.size = size;
    this.boardBackgroundColor = boardBackgroundColor;
    this.boardLineColor = boardLineColor;
    this.boardLineWith = boardLineWith;
    this.cellSize = cellSize;
    this.circleStoneColor = circleStoneColor;
    this.crossStoneColor = crossStoneColor;
    this.stoneLineWidth = stoneLineWidth;
    this.stoneSize = stoneSize;


    this.halfCellSize = this.cellSize / 2;
    this.stoneSpaceSize = (this.cellSize - this.stoneSize) / 2;
    this.height = this.width = this.cellSize * this.size;
    this.lineLength = this.width;
  }

  drawBoard() {
    // draw background
    this.drawBackground();

    // make some lines
    this.drawLines();
  }

  drawBackground() {
  }

  drawLines() {
  }


  addStone(column, row, type) {
    const { stoneSize, stoneLineWidth, circleStoneColor, crossStoneColor } = this;

    console.log(`adding stone to column: ${column} row: ${row}`);

    const { x, y } = this.transformToXY(column, row);

    const stoneParams = {
      lineWidth: stoneLineWidth,
      size: stoneSize,
    };

    let stone;
    if (type === 'cross') {
      stone = new Stone({});
    }

    if (type === 'circle') {
      stoneParams.color = circleStoneColor;
      stone = new CircleStone(stoneParams);
    } else {
      stoneParams.color = crossStoneColor;
      stone = new CrossStone(stoneParams);
    }

    stone.move(x, y);
  }

  drawCrossLine(row1, column1, row2, column2) {
  }

  removeCrossLine(stones, stoneType) {
    stones.forEach((stone, index) => {
      this.removeStone(stone.column, stone.row);
      this.addStone(stone.column, stone.row, stoneType)
    });
  }

  removeStone(column, row) {
  }

  /**
   * calculate the column and row of stone base on x,y
   * @param x
   * @param y
   * @returns {{column: number, row: number}}
   */
  transformToPosition(x, y) {
    const column = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    return { column, row };
  }

  transformToXY(column, row) {
    const { cellSize, halfCellSize } = this;
    const x = Math.floor(column * cellSize) + halfCellSize;
    const y = Math.floor(row * cellSize) + halfCellSize;
    return { x, y };
  }

  handleCellClick(event) {

    const { column, row } = event;

    this.eventHub.emit('cell_click', column, row);
  }

  addCellClickListener(listener) {
    this.eventHub.on('cell_click', listener);
  }
}

