// 发布订阅者模式
function EventEmitter () {
  // 用Object.create(null) 代替 {}，好处是无杂质，不继承原型链的东西
  this._events = Object.create(null)
}
// 默认最多绑定此次数
EventEmitter.defaultMaxListeners = 10
EventEmitter.prototype.addListener = EventEmitter.prototype.on
// 返回监听事件名
EventEmitter.prototype.eventNames = function () {
  return Object.keys(this._events)
}
// 设置最大监听数
EventEmitter.prototype.setMaxListener = function (n) {
  this._count = n
}
// 返回监听数
EventEmitter.prototype.getMaxListener = function () {
  return this._count ? this._count : this.defaultMaxListeners
}
// 监听
EventEmitter.prototype.on = function (type, cb, flag) {
  // 默认值，如果没有_events,就创建一个
  if (!this._events) {
    this._events = Object.create(null)
  }
  // 不是newListener 就应该让newListener执行以下
  if (type !== 'newListener') {
    this._events['newListener'] &&
      this._events['newListener'].forEach(listener => {
        listener(type)
      })
  }
  if (this._events[type]) {
    // 根据出传入的flag来决定向前还是向后添加
    if (flag) {
      this._events[type].unshift(cb)
    } else {
      this._events[type].push(cb)
    }
  } else {
    this._events[type] = cb
  }
  // 监听事件不能超过最大监听数
  if (this._events[type].length === this.getMaxListener()) {
    console.log('警告')
  }
}
// 向前添加
EventEmitter.prototype.prependListener = function (type, cb) {
  this.on(type, cb, true)
}
EventEmitter.prototype.prependOnceListener = function (type, cb) {
  this.once(type, cb, true)
}
// 监听一次
EventEmitter.prototype.once = function (type, cb, flag) {
  // 先绑定，调用后删除
  function wrap () {
    cb(...arguments)
    this.removeListener(type, wrap)
  }
  // 自定义属性
  wrap.listen = cb
  this.on(type, wrap, flag)
}
// 删除监听类型
EventEmitter.prototype.removeListener = function (type, cb) {
  if (this._events[type]) {
    this._events[type] = this._events[type].filter(listener => {
      return cb !== listener && cb !== listener.listen
    })
  }
}
EventEmitter.prototype.removeAllListener = function () {
  this._events = Object.create(null)
}
// 返回所有监听类型
EventEmitter.prototype.listeners = function (type) {
  return this._events[type]
}
// 发布
EventEmitter.prototype.emit = function (type, ...args) {
  if (this._events[type]) {
    this._events[type].forEach(listener => {
      listener.call(this, ...args)
    })
  }
}

module.exports = EventEmitter
