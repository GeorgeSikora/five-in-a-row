/**
 * Created by Xin on 12/05/2017.
 */

class GoBoard {
  constructor({ boardBackgroundColor, boardLineColor, boardLineWith, cellSize, circleStoneColor, crossStoneColor, ctx, size, stoneLineWidth, stoneSize, }) {
    this.eventHub = new EventHub();
    this.ctx = ctx;
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

    ctx.canvas.addEventListener('click', (event) => {
      //return;

      console.log(event);
      this.handleCellClick.call(this, event);
    });
  }

  drawBoard() {
    // draw background
    this.drawBackground();

    // make some lines
    this.drawLines();
  }

  drawBackground() {
    const { ctx, boardBackgroundColor, width, height } = this;
    ctx.fillStyle = boardBackgroundColor;
    ctx.rect(0, 0, width, height);
    ctx.fill();
  }

  drawLines() {
    const { ctx, cellSize, size, lineLength, boardLineColor, boardLineWith } = this;
    ctx.beginPath();
    ctx.strokeStyle = boardLineColor;
    ctx.lineWidth = boardLineWith;

    // horizontal lines
    for (let i = 0; i <= size; i++) {
      const y = cellSize * i + 0.5; // add 0.5 to make line more clear
      ctx.moveTo(0, y);
      ctx.lineTo(lineLength, y);
    }

    // vertical lines
    for (let j = 0; j <= size; j++) {
      const x = cellSize * j + 0.5; // add 0.5 to make line more clear
      ctx.moveTo(x, 0);
      ctx.lineTo(x, lineLength);
    }

    ctx.stroke();
    ctx.closePath();
  }


  addStone(column, row, type) {
    const { ctx, stoneSize, stoneLineWidth, circleStoneColor, crossStoneColor } = this;

    console.log(`adding stone to column: ${column} row: ${row}`);

    const { x, y } = this.transformToXY(column, row);

    const stoneParams = {
      ctx,
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
    const { ctx } = this;

    let { x: x1, y: y1 } = this.transformToXY(column1, row1);
    let { x: x2, y: y2 } = this.transformToXY(column2, row2);

    ctx.beginPath();
    ctx.lineWidth = this.boardLineWith;
    ctx.strokeStyle = this.boardLineColor;
    ctx.moveTo(x1 + 0.5, y1 + 0.5); // add 0.5 to make line more clear
    ctx.lineTo(x2 + 0.5, y2 + 0.5); // add 0.5 to make line more clear
    ctx.stroke();
    ctx.closePath();

  }

  removeCrossLine(stones, stoneType) {
    stones.forEach((stone, index) => {
      this.removeStone(stone.column, stone.row);
      this.addStone(stone.column, stone.row, stoneType)
    });
  }

  removeStone(column, row) {
    const { ctx, stoneSize, stoneLineWidth, halfCellSize, cellSize, boardLineWith, boardLineColor, boardBackgroundColor } = this;
    let { x, y } = this.transformToXY(column, row);

    x = x - halfCellSize;
    y = y - halfCellSize;
    const width = cellSize + boardLineWith;
    const height = width;

    // clear cell
    ctx.beginPath();
    ctx.clearRect(x, y, width, height);
    ctx.fillStyle = boardBackgroundColor;
    ctx.fillRect(x, y, width, height);
    ctx.fill();
    ctx.closePath();

    // draw borders
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = boardLineColor;
    ctx.moveTo(x + 0.5, y + 0.5);
    ctx.lineTo(x + 0.5, y + cellSize + 0.5);
    ctx.lineTo(x + cellSize + 0.5, y + cellSize + 0.5);
    ctx.lineTo(x + cellSize + 0.5, y + 0.5);
    ctx.lineTo(x + 0.5, y + 0.5);
    ctx.stroke();
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
    const { eventHub, ctx } = this;
    const rect = ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { column, row } = this.transformToPosition(x, y);
    eventHub.emit('cell_click', column, row);
  }

  addCellClickListener(listener) {
    this.eventHub.on('cell_click', listener);
  }
}

