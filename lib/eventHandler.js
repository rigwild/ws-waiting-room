import EventEmitter from 'events'
import MSG_ID from './msgId.config'

/**
 * @type {EventEmitter} The app's event emitter
 */
export const emitter = new EventEmitter()

const events = {
  ROOM_CREATED: (room, clientId, clientName) => emitter.emit(MSG_ID.room.ROOM_CREATED, { room, roomAuthor: { id: clientId, name: clientName } }),
  ROOM_EXITED: (room, clientId, clientName) => emitter.emit(MSG_ID.room.ROOM_EXITED, { room, clientId, clientName }),
  ROOM_JOINED: (room, clientId, clientName) => emitter.emit(MSG_ID.room.ROOM_JOINED, { room, clientId, clientName }),
  ROOM_READY: room => emitter.emit(MSG_ID.room.ROOM_READY, room),
  ROOM_ERROR: (...obj) => emitter.emit(MSG_ID.room.ROOM_ERROR, ...obj),

  WS_MSG: msg => emitter.emit(MSG_ID.WS_MSG, msg),
  WS_MSG_JSON: msg => emitter.emit(MSG_ID.WS_MSG_JSON, msg),
  WS_ERROR: error => emitter.emit(MSG_ID.WS_ERROR, error)
}

export default events
