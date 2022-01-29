/**
 * Created by Xin on 14/07/2017.
 */

const ZobristHash = require('./ZobristHash');
const TranspositionTable = require('../model/TranspositionTable');
const TranspositionTableEntry = require('../model/TranspositionTableEntry');
const Move = require('../model/Move');

module.exports = class Evaluator {

  constructor(props) {
    this.depth = props.depth || 7;
    this.board = props.board || { size: 15 };
    this.zobristHash = new ZobristHash(this.board.size);
    this.transpositionTable = new TranspositionTable(50000);

    this.scores = {
      'ooooo': 50000,
      'xoooxx': 720,
      'xooxox': 720,
      'oooox': 720,
      'ooxoo': 720,
      'oooxo': 720,
      'xxoxox': 120,
      'xxxoxx': 20,

      'xoooox': 4320,
      'xxooox': 720,
      'xoxoox': 720,
      'xoooo': 720,
      'oxooo': 720,
      'xxooxx': 720,
      'xoxoxx': 120,
      'xxoxxx': 20,
    };
  }

  setDepth(depth) {
    this.depth = depth;
  }

  evaluatePoints(points, playerId, opponentId) {

    let totalValue = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[i].length; j++) {
        if (points[i][j] === playerId) {
          totalValue += this.evaluatePoint(points, i, j, playerId);
        } else if (points[i][j] === opponentId) {
          totalValue -= this.evaluatePoint(points, i, j, opponentId);
        }
      }
    }

    return totalValue;
  }

  evaluatePoint(points, row, column, playerId) {

    let totalValue = 0;
    //  direction: -
    let pattern = Evaluator.generatePattern(points, row, column, 0, 1, playerId);
    totalValue += this.evaluatePattern(pattern);
    //  direction: |
    pattern = Evaluator.generatePattern(points, row, column, 1, 0, playerId);
    totalValue += this.evaluatePattern(pattern);
    //  direction: \
    pattern = Evaluator.generatePattern(points, row, column, 1, 1, playerId);
    totalValue += this.evaluatePattern(pattern);
    //  direction: /
    pattern = Evaluator.generatePattern(points, row, column, -1, 1, playerId);
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

  static generateLegalMoves(points, playerId, opponentId) {
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

        if (Evaluator.hasAdjacent(points, i, j)) {
          let patternI = Evaluator.generateMaxLegalPattern(points, i, j, playerId);
          let patternII = Evaluator.generateMaxLegalPattern(points, i, j, opponentId);

          if ('ooooo' === patternI || 'ooooo' === patternII) {
            return [new Move(i, j)];
          }

          if ('oooo' === patternI || 'oooo' === patternII) {
            oooo.push(new Move(i, j));
          } else if ('ooo' === patternI || 'ooo' === patternII) {
            ooo.push(new Move(i, j));
          } else if ('oo' === patternI || 'oo' === patternII) {
            o.push(new Move(i, j));
          } else if ('o' === patternI || 'o' === patternII) {
            o.push(new Move(i, j));
          } else {
            x.push(new Move(i, j));
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

  static hasAdjacent(points, row, column) {

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

  static generateLegalPattern(pattern) {
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

  static generateMaxLegalPattern(points, row, column, playerId) {
    let max;
    //  direction: -
    let patternH = Evaluator.generatePattern(points, row, column, 0, 1, playerId);
    max = Evaluator.generateLegalPattern(patternH);

    //  direction: |
    let patternV = Evaluator.generatePattern(points, row, column, 1, 0, playerId);
    patternV = Evaluator.generateLegalPattern(patternV);
    if (max.length < patternV.length) {
      max = patternV;
    }

    //  direction: \
    let patternLT = Evaluator.generatePattern(points, row, column, 1, 1, playerId);
    patternLT = Evaluator.generateLegalPattern(patternLT);
    if (max.length < patternLT.length) {
      max = patternLT;
    }

    //  direction: /
    let patternRT = Evaluator.generatePattern(points, row, column, -1, 1, playerId);
    patternRT = Evaluator.generateLegalPattern(patternRT);
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
  static generatePattern(points, row, column, rowStep, columnStep, playerId) {
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


  ProbeHash(hash, depth, alpha, beta) {
    let entry = this.transpositionTable.getEntry(hash);


    if (entry) {
      if (entry.depth >= depth) {
        if (entry.hashf === 0) {
          return entry.score;
        }
        if ((entry.hashf === 1) && (entry.score <= alpha)) {
          return alpha;
        }
        if ((entry.hashf === 2) && (entry.score >= beta)) {
          return beta;
        }
      }
    }
    return null;
  }

  RecordHash(hash, depth, score, hashf) {
    let entry = new TranspositionTableEntry({ hash, depth, score, hashf });
    this.transpositionTable.addEntry(entry);
  }


  minimax(points, depth, maximizingPlayer, playerId, opponentId) {

    if (depth === 0) {
      return this.evaluatePoints(points, playerId, opponentId);
    }

    const moves = Evaluator.generateLegalMoves(points, playerId, opponentId);

    // no more move is available, match end
    if (moves.length < 0) {
      return this.evaluatePoints(points, playerId, opponentId);
    }

    if (maximizingPlayer) {
      let bestValue = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < moves.length; i++) {
        points[moves[i].row][moves[i].column] = playerId;


        let value = this.minimax(points, depth - 1, false, playerId, opponentId);
        bestValue = Math.max(value, bestValue);
        points[moves[i].row][moves[i].column] = ' ';
      }
      return bestValue;
    } else {
      let bestValue = Number.POSITIVE_INFINITY;
      for (let i = 0; i < moves.length; i++) {
        points[moves[i].row][moves[i].column] = opponentId;
        let value = this.minimax(points, depth - 1, true, playerId, opponentId);
        bestValue = Math.min(value, bestValue);
        points[moves[i].row][moves[i].column] = ' ';
      }
      return bestValue;
    }

  };

  alphaBeta(points, depth, alpha, beta, maximizingPlayer, playerId, opponentId) {

    if (depth === 0) {
      return this.evaluatePoints(points, playerId, opponentId);
    }

    const moves = Evaluator.generateLegalMoves(points, playerId, opponentId);

    // no more move is available, match end
    if (moves.length < 0) {
      return this.evaluatePoints(points, playerId, opponentId);
    }

    if (maximizingPlayer) {
      let bestValue = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < moves.length; i++) {
        points[moves[i].row][moves[i].column] = playerId;
        bestValue = this.alphaBeta(points, depth - 1, alpha, beta, false, playerId, opponentId);
        points[moves[i].row][moves[i].column] = ' ';
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      return bestValue;
    } else {
      let bestValue = Number.POSITIVE_INFINITY;
      for (let i = 0; i < moves.length; i++) {
        points[moves[i].row][moves[i].column] = opponentId;
        bestValue = this.alphaBeta(points, depth - 1, alpha, beta, true, playerId, opponentId);
        points[moves[i].row][moves[i].column] = ' ';
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      return bestValue;
    }

  }


  trans(points, depth, alpha, beta, maximizingPlayer, playerId, opponentId) {

    const hash = this.zobristHash.hash(points);

    let score = this.ProbeHash(hash, depth, alpha, beta);
    if (score !== null) {
      return score;
    }


    if (depth === 0) {
      let score = this.evaluatePoints(points, playerId, opponentId);
      this.RecordHash(hash, depth, score, 0, move);
      return score;
    }

    const moves = Evaluator.generateLegalMoves(points, playerId, opponentId);

    // no more move is available, match end
    if (moves.length < 0) {
      let score = this.evaluatePoints(points, playerId, opponentId);
      this.RecordHash(hash, depth, score, 0, move);
      return score;
    }

    if (maximizingPlayer) {
      let bestValue = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < moves.length; i++) {
        points[moves[i].row][moves[i].column] = playerId;
        bestValue = this.alphaBeta(points, depth - 1, alpha, beta, false, playerId, opponentId);
        points[moves[i].row][moves[i].column] = ' ';
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      this.RecordHash(hash, depth, bestValue, 1);
      return bestValue;
    } else {
      let bestValue = Number.POSITIVE_INFINITY;
      for (let i = 0; i < moves.length; i++) {
        points[moves[i].row][moves[i].column] = opponentId;
        bestValue = this.alphaBeta(points, depth - 1, alpha, beta, true, playerId, opponentId);
        points[moves[i].row][moves[i].column] = ' ';
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      this.RecordHash(hash, depth, bestValue, 2);
      return bestValue;
    }

  }

  findBestMoveByMinimax(points, playerId, opponentId) {

    let max = Number.NEGATIVE_INFINITY;

    let bestMoveIndex = 0;

    const moves = Evaluator.generateLegalMoves(points, playerId, opponentId);
    for (let i = 0; i < moves.length; i++) {

      points[moves[i].row][moves[i].column] = playerId;
      let value = this.minimax(points, this.depth, false, playerId, opponentId);
      points[moves[i].row][moves[i].column] = ' ';

      if (value > max) {
        max = value;
        bestMoveIndex = i;
      }
    }

    return moves[bestMoveIndex];
  }


  findBestMoveByAlphaBeta(points, playerId, opponentId) {

    let max = Number.NEGATIVE_INFINITY;
    let bestMoveIndex = 0;
    const moves = Evaluator.generateLegalMoves(points, playerId, opponentId);

    for (let i = 0; i < moves.length; i++) {
      points[moves[i].row][moves[i].column] = playerId;
      let value = this.alphaBeta(points, this.depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, playerId, opponentId);

      points[moves[i].row][moves[i].column] = ' ';


      if (value > max) {
        max = value;
        bestMoveIndex = i;
      }
    }

    return moves[bestMoveIndex];
  }

  findBestMove(points, playerId, opponentId) {

    let max = Number.NEGATIVE_INFINITY;

    let bestMoveIndex = 0;

    const moves = Evaluator.generateLegalMoves(points, playerId, opponentId);
    for (let i = 0; i < moves.length; i++) {

      points[moves[i].row][moves[i].column] = playerId;
      let value = this.trans(points, this.depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, playerId, opponentId);
      points[moves[i].row][moves[i].column] = ' ';

      if (value > max) {
        max = value;
        bestMoveIndex = i;
      }
    }

    return moves[bestMoveIndex];
  }

}
