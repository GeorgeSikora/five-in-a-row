/**
 * Created by Xin on 06/06/2017.
 */

 module.exports = class TranspositionTable {

  constructor(size = 50000) {
    this.size = size;
    this.table = new Array(size).fill(null);
  }

  getEntry(hash) {
    let entry = this.table[hash % this.size];
    if (entry && entry.hash === hash) {
      return entry;
    }
    return null;
  }

  addEntry(entry) {
    let index = entry.hash % this.size;
    if (this.table[index]) {
      if (entry.hashf !== 0 && entry.depth < this.table[index].depth) {
        return;
      }
    }
    this.table[index] = entry;
  }
}