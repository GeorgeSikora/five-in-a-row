/**
 * Created by Xin on 12/05/2017.
 */


 module.exports = class EventHub {
  constructor() {
    this._events = {};
  }

  on(name, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function!');
    }

    this._events[name] = this._events[name] || [];
    this._events[name].push(listener);
  }

  removeListener(name, listener) {
    if (this._events[name]) {
      this._events[name] = this._events[name].filter((_listener) => {
        return _listener !== listener;
      });
    }
  }

  emit(name, ...args) {
    if (this._events[name]) {
      this._events[name].forEach((listener) => {
        listener.call(null, ...args);
      });
    }
  }
}
