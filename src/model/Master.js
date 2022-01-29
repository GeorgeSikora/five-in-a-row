/**
 * Created by Xin on 28/05/2017.
 */

const Player = require('./Player');

module.exports = class Master extends Player {

  constructor({ id, level = 'normal', evaluator, opponentId }) {
    super({ id });
    this.evaluator = evaluator;
    this.setLevel(level);
    this.opponentId = opponentId;
  }

  setLevel(level) {
    this.level = level;
    switch (level) {
      case 'hard':
        this.evaluator.setDepth(10);
        break;
      case 'easy':
        this.evaluator.setDepth(3);
        break;
      case 'normal':
      default:
        this.evaluator.setDepth(7);
        break;
    }
  }

  think(points) {
    const bestMove = this.evaluator.findBestMove(points, this.id, this.opponentId);
    return bestMove;
  }
}