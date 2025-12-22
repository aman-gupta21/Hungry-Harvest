import EventEmitter from 'events'

const orderEmitter = new EventEmitter()

// small wrapper for consistent event shape
const emitOrder = (type, payload) => {
  try {
    orderEmitter.emit('order', { type, payload, timestamp: Date.now() })
  } catch (e) {
    console.error('Error emitting order event', e)
  }
}

export { orderEmitter, emitOrder }