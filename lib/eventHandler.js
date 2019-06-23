import EventEmitter from 'events'
import MSG_ID from '../msgId.config'

let emitter

export const getEmitter = () => {
  if (!emitter) emitter = new EventEmitter()
  return emitter
}

export const emit = (eventName, ...obj) => {
  const ee = getEmitter()
  ee.emit(eventName, ...obj)
}


export const ROOM_CREATED = (room, clientId, clientName) =>
  emit(MSG_ID.room.ROOM_CREATED, { room, roomAuthor: { id: clientId, name: clientName } })
export const ROOM_EXITED = (room, clientId, clientName) => emit(MSG_ID.room.ROOM_EXITED, { room, clientId, clientName })
export const ROOM_JOINED = (room, clientId, clientName) => emit(MSG_ID.room.ROOM_EXITED, { room, clientId, clientName })
export const ROOM_READY = room => emit(MSG_ID.room.ROOM_READY, room)

export const ROOM_ERROR = (...obj) => emit(MSG_ID.room.ROOM_ERROR, ...obj)


export const WS_MSG = msg => emit(MSG_ID.WS_MSG, msg)
export const WS_MSG_JSON = msg => emit(MSG_ID.WS_MSG_JSON, msg)
export const WS_ERROR = error => emit(MSG_ID.WS_ERROR, error)

export default {
  ROOM_CREATED,
  ROOM_READY,
  ROOM_ERROR,
  WS_ERROR
}
