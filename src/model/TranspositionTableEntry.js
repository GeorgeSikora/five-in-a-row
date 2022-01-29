/**
 * Created by Xin on 06/06/2017.
 */

 module.exports = class TranspositionTableEntry {
  constructor({ hash, depth, score, alphaOrig, flags, hashf }) {
    this.hash = hash;
    this.flags = flags;
    this.depth = depth;
    this.score = score;
    this.hashf = hashf;
    this.alphaOrig = alphaOrig;
  }
}