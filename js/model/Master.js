/**
 * Created by Xin on 28/05/2017.
 */

class Master extends Player {

  constructor(id, level, opponentId) {
    super(id);

    this.level = level;

    switch (level) {
      case 'normal':
        this.depth = 5;
        this.limit = 8;
        break;
      case 'hard':
        this.depth = 8;
        this.limit = 16;
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
      'xxooo': 1500,
      'oooxx': 1500,
      'xooxo': 800,
      'xoxoo': 800,
      'ooxox': 800,
      'oxoox': 800,
      'xooxx': 150,
      'xxoox': 150,
      'ooxxx': 100,
      'xxxoo': 100,
      'xxoxx': 40,
      'oxoxx': 80,
      'xxoxo': 80,
    };

  }

  minMax(points, playerId, attacker, defender, move, depth, alpha, beta) {

    if (depth <= 0) {
      return this.evaluatePoints(points, attacker);
    }

    const copyPoints = JSON.parse(JSON.stringify(points));
    copyPoints[move.row][move.column] = playerId;
    const moves = this.generateLegalMoves(copyPoints, attacker, defender);
    const limit = Math.min(moves.length, this.limit);

    // no more move is available, match end
    if (moves.length < 1) {
      return this.evaluatePoints(copyPoints, attacker);
    }

    if (playerId === attacker) {
      let bestValue = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < limit; i++) {
        bestValue = this.minMax(copyPoints, defender, attacker, defender, moves[i], depth - 1, alpha, beta);
        alpha = Math.max(alpha, bestValue);
        if (alpha >= beta)
          break;
      }
      return bestValue;
    } else {
      let bestValue = Number.POSITIVE_INFINITY;
      for (let i = 0; i < limit; i++) {
        bestValue = this.minMax(copyPoints, attacker, attacker, defender, moves[i], depth - 1, alpha, beta);
        beta = Math.min(beta, bestValue);
        if (alpha >= beta)
          break;
      }
      return bestValue;
    }
  }

  sortMoves(points, moves, playerId, reserve = false) {
    let valMap = new Map();
    let curKey;
    let nextKey;
    let curVal;
    let nextVal;
    let direction = reserve ? -1 : 1;
    moves.sort((cur, next) => {
      curKey = `${cur.row}-${cur.column}`;
      nextKey = `${next.row}-${next.column}`;
      curVal = 0;
      nextVal = 0;
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
      return (curVal < nextVal ? 1 : curVal === nextVal ? 0 : -1) * direction;
    })
  }

  evaluatePoints(points, attacker) {
    let totalValue = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[i].length; j++) {
        if (points[i][j] === attacker) {
          totalValue += this.evaluatePoint(points, { row: i, column: j }, attacker);
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

  generateLegalMoves(points, playerI, playerII) {
    let ooooo = [];
    let oooo = [];
    let ooo = [];
    let oo = [];
    let o = [];
    let x = [];

    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[i].length; j++) {
        if (points[i][j] !== ' ') {
          continue;
        }

        if (this.hasNeighbour(points, i, j)) {
          let patternI = playerI && this.generateMaxLegalPattern(points, i, j, playerI);
          let patternII = playerII && this.generateMaxLegalPattern(points, i, j, playerII);

          if ('ooooo' === patternI || 'ooooo' === patternII) {
            return [{ row: i, column: j }];
          }

          if ('oooo' === patternI || 'oooo' === patternII) {
            oooo.push({ row: i, column: j });
          } else if ('ooo' === patternI || 'ooo' === patternII) {
            ooo.push({ row: i, column: j });
          } else if ('oo' === patternI || 'oo' === patternII) {
            o.push({ row: i, column: j });
          } else if ('o' === patternI || 'o' === patternII) {
            o.push({ row: i, column: j });
          } else {
            x.push({ row: i, column: j });
          }
        }
      }
    }

    if (oooo.length > 0) {
      return oooo;
    }


    if (ooo.length > 0) {
      return ooo;
    }

    return oo.concat(o).concat(x);
  }

  hasNeighbour(points, row, column) {

    // west
    if (points[row][column + 1] && points[row][column + 1] !== ' ') {
      return true;
    }
    // east
    if (points[row][column - 1] && points[row][column - 1] !== ' ') {
      return true;
    }
    // north
    if (points[row - 1] && points[row - 1][column] && points[row - 1][column] !== ' ') {
      return true;
    }

    // south
    if (points[row + 1] && points[row + 1][column] && points[row + 1][column] !== ' ') {
      return true;
    }

    // east south
    if (points[row + 1] && points[row + 1][column + 1] && points[row + 1][column + 1] !== ' ') {
      return true;
    }

    // west south
    if (points[row + 1] && points[row + 1][column - 1] && points[row + 1][column - 1] !== ' ') {
      return true;
    }

    // west north
    if (points[row - 1] && points[row - 1][column - 1] && points[row - 1][column - 1] !== ' ') {
      return true;
    }

    // east north
    if (points[row - 1] && points[row - 1][column + 1] && points[row - 1][column + 1] !== ' ') {
      return true;
    }
  }

  generateLegalPattern(pattern) {
    if (pattern.length < 5) {
      return '';
    }

    if (pattern.indexOf('ooooo') > -1) {
      return 'ooooo';
    } else if (pattern.indexOf('oooo') > -1) {
      return 'oooo';
    } else if (pattern.indexOf('ooo') > -1) {
      return 'ooo';
    } else if (pattern.indexOf('oo') > -1) {
      return 'oo';
    } else if (pattern.indexOf('o') > -1) {
      return 'o';
    } else {
      return '';
    }
  }

  generateMaxLegalPattern(points, row, column, playerId) {
    let max;
    //  direction: -
    let patternH = this.generatePattern(points, row, column, 0, 1, playerId);
    max = this.generateLegalPattern(patternH);

    //  direction: |
    let patternV = this.generatePattern(points, row, column, 1, 0, playerId);
    patternV = this.generateLegalPattern(patternV);
    if (max.length < patternV.length) {
      max = patternV;
    }

    //  direction: \
    let patternLT = this.generatePattern(points, row, column, 1, 1, playerId);
    patternLT = this.generateLegalPattern(patternLT);
    if (max.length < patternLT.length) {
      max = patternLT;
    }

    //  direction: /
    let patternRT = this.generatePattern(points, row, column, -1, 1, playerId);
    patternRT = this.generateLegalPattern(patternRT);
    if (max.length < patternRT.length) {
      max = patternRT;
    }

    return max;
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
    let max = Number.NEGATIVE_INFINITY;
    let bestMoveIndex = 0;
    const moves = this.generateLegalMoves(points, attacker, defender);
    const limit = Math.min(moves.length, this.limit);
    for (let i = 0; i < limit; i++) {
      let move = moves[i];

      let value = this.minMax(points, attacker, attacker, defender, move, this.depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
      value += this.minMax(points, defender, defender, attacker, move, this.depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

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