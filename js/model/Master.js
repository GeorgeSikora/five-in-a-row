/**
 * Created by Xin on 28/05/2017.
 */

class Master extends Player {

  constructor(id, level, opponentId) {
    super(id);

    this.level = level;

    switch (level) {
      case 'normal':
        this.depth = 8;
        this.limit = 5;
        break;
      case 'hard':
        this.depth = 16;
        this.limit = 7;
        break;
      case 'easy':
      default:
        this.depth = 3;
        this.limit = 4;
        break;
    }

    this.opponentId = opponentId;

    this.scores = {
      'ooooo': 99999,
      'xoooox': 7000,
      'xoooo': 4000,
      'oooox': 4000,
      'xoxooo': 2000,
      'xooxoo': 2000,
      'xoooxo': 2000,
      'oooxox': 2000,
      'ooxoox': 2000,
      'oxooox': 2000,

      'oxooo': 2000,
      'oooxo': 2000,

      'xooox': 3000,
      'xooo': 1500,
      'ooox': 1500,
      'xooxo': 800,
      'xoxoo': 800,
      'ooxox': 800,
      'oxoox': 800,
      'xoox': 200,
      'xxoxx': 40,
      'oxox': 80,
      'xoxo': 80,
      // 'ox': 10,
      // 'xo': 10,
    };

  }

  minMax(points, playerId, attacker, defender, move, depth, alpha, beta) {

    if (depth <= 0) {
      return this.evaluatePoints(points, attacker);
    }

    const copyPoints = JSON.parse(JSON.stringify(points));
    copyPoints[move.row][move.column] = playerId;
    const moves = this.findAvailableMoves(copyPoints);

    // no more move is available, match end
    //
    if (moves.length < 1) {
      return this.evaluatePoints(copyPoints, playerId);
    } else if (moves.length > 1) {
      this.sortMoves(points, moves, playerId);
    }

    const limit = Math.min(moves.length, this.limit);
    if (playerId === attacker) {
      for (let i = 0; i < limit; i++) {
        const value = this.minMax(copyPoints, defender, attacker, defender, moves[i], depth - 1, alpha, beta);
        alpha = Math.max(alpha, value);
        if (alpha >= beta)
          break;
      }
      return alpha;
    } else {
      for (let i = 0; i < limit; i++) {
        const value = this.minMax(copyPoints, attacker, attacker, defender, moves[i], depth - 1, alpha, beta);
        beta = Math.min(beta, value);
        if (alpha >= beta)
          break;
      }
      return beta;
    }
  }

  sortMoves(points, moves, playerId) {
    let valMap = new Map();
    let curKey;
    let nextKey;
    let curVal;
    let nextVal;
    moves.sort((cur, next) => {
      curKey = `${cur.row}-${cur.column}`;
      nextKey = `${next.row}-${next.column}`;
      if (valMap.has(curKey)) {
        curVal = valMap.get(curKey);
      } else {
        curVal = this.evaluatePoint(points, cur, playerId);
        valMap.set(curKey, curVal);
      }
      if (valMap.has(nextKey)) {
        nextVal = valMap.get(nextKey);
      } else {
        nextVal = this.evaluatePoint(points, next, playerId);
        valMap.set(nextKey, nextVal);
      }
      return curVal < nextVal ? 1 : curVal === nextVal ? 0 : -1;
    })
  }

  evaluatePoints(points, playerId) {
    let totalValue = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[i].length; j++) {
        if (points[i][j] === playerId) {
          totalValue += this.evaluatePoint(points, { row: i, column: j }, playerId);
        }
      }
    }
    return totalValue;
  }

  evaluatePoint(points, move, playerId) {
    let totalValue = 0;
    //  direction: -
    let pattern = this.generatePattern(points, move.row, move.column, 0, 1, playerId);
    totalValue += this.evaluatePattern(pattern);
    //  direction: |
    pattern = this.generatePattern(points, move.row, move.column, 1, 0, playerId);
    totalValue += this.evaluatePattern(pattern);
    //  direction: \
    pattern = this.generatePattern(points, move.row, move.column, 1, 1, playerId);
    totalValue += this.evaluatePattern(pattern);
    //  direction: /
    pattern = this.generatePattern(points, move.row, move.column, -1, 1, playerId);
    totalValue += this.evaluatePattern(pattern);
    return totalValue;
  }

  evaluatePattern(pattern) {
    let totalValue = 0;
    Object.keys(this.scores).forEach((key) => {
      if (pattern.indexOf(key) > -1) {
        totalValue += this.scores[key];
      }
    });

    return totalValue;
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
   * @param row
   * @param column
   * @param rowStep
   * @param columnStep
   * @param playerId
   * @returns {string}
   */
  generatePattern(points, row, column, rowStep, columnStep, playerId) {
    let pattern = 'o';

    for (let i = 1; i <= 4; i++) {
      let currentRow = row - rowStep * i;
      let currentColumn = column - columnStep * i;

      if (points[currentRow] && points[currentRow][currentColumn] === playerId) {
        pattern = 'o' + pattern;
      } else if (points[currentRow] && points[currentRow][currentColumn] === ' ') {
        pattern = 'x' + pattern;
      } else {
        break;
      }
    }

    for (let i = 1; i <= 4; i++) {
      let currentRow = row + rowStep * i;
      let currentColumn = column + columnStep * i;
      if (points[currentRow] && points[currentRow][currentColumn] === playerId) {
        pattern += 'o';
      } else if (points[currentRow] && points[currentRow][currentColumn] === ' ') {
        pattern += 'x';
      } else {
        break;
      }
    }
    return pattern;
  }

  findAvailableMoves(points) {
    const moves = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        if (points[i][j] === ' ') {
          moves.push({
            row: i,
            column: j,
          });
        }
      }
    }
    return moves;
  }

  findBestMove(points, attacker, defender) {
    const moves = this.findAvailableMoves(points);
    const playerId = attacker;
    let max = Number.MIN_VALUE;
    let bestMoveIndex = null;
    this.sortMoves(points, moves, playerId);
    const limit = Math.min(moves.length, this.limit);
    for (let i = 0; i < limit; i++) {
      let move = moves[i];
      const value = this.minMax(points, playerId, attacker, defender, move, this.depth, Number.MIN_VALUE, Number.MAX_VALUE);

      if (value > max) {
        max = value;
        bestMoveIndex = i;
      }
    }
    return moves[bestMoveIndex];
  }

  think(points) {
    const bestMove = this.findBestMove(points, this.id, this.opponentId);
    return bestMove;
  }
}