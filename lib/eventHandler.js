import EventEmitter from 'events'
import MSG_ID from './msgId.config'

/**
 * @type {EventEmitter} The app's event emitter
 */
let emitter

/**
 * Get the app's Event Emitter, creates it if not set
 * @returns {EventEmitter} The app event emitter
 */
export const getEmitter = () => {
  if (!emitter) emitter = new EventEmitter()
  return emitter
}

/**
 * Emit an event
 * @param {String} eventName The name of the event
 * @param  {...any} obj Any data to pass with the event
 * @returns {void}
 */
export const emit = (eventName, ...obj) => {
  const ee = getEmitter()
  ee.emit(eventName, ...obj)
}

const events = {
  ROOM_CREATED: (room, clientId, clientName) => emit(MSG_ID.room.ROOM_CREATED, { room, roomAuthor: { id: clientId, name: clientName } }),
  ROOM_EXITED: (room, clientId, clientName) => emit(MSG_ID.room.ROOM_EXITED, { room, clientId, clientName }),
  ROOM_JOINED: (room, clientId, clientName) => emit(MSG_ID.room.ROOM_EXITED, { room, clientId, clientName }),
  ROOM_READY: room => emit(MSG_ID.room.ROOM_READY, room),
  ROOM_ERROR: (...obj) => emit(MSG_ID.room.ROOM_ERROR, ...obj),

  WS_MSG: msg => emit(MSG_ID.WS_MSG, msg),
  WS_MSG_JSON: msg => emit(MSG_ID.WS_MSG_JSON, msg),
  WS_ERROR: error => emit(MSG_ID.WS_ERROR, error)
}

export default events
