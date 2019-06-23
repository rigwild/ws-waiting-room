import WebSocket from 'ws'
import uuid from 'uuid/v4'

import { newRoom, exitRoom, joinRoom, getRooms, getRoomRemainingSize, getARoom } from './queueHandler'
import MSG_ID from '../../msgId.config'
import eventHandler from '../eventHandler'

export const serializeError = err => ({ msg: err.message })
export const sendMsg = (ws, msgId, obj = {}) => ws.send(JSON.stringify({ msgId, msg: { ...obj } }))
export const sendError = (ws, msgId, err) => sendMsg(ws, msgId, serializeError(err))
export const broadcast = (wsClients, msgId, msg) => {
  wsClients.filter(client => client.readyState === WebSocket.OPEN)
    .forEach(client => sendMsg(client, msgId, msg))
}

export const actions = {
  LIST_ROOMS(ws) {
    const rooms = getRooms()
    console.info(`Client uuid=${ws.uuid} asked for rooms list`)
    sendMsg(ws, MSG_ID.LIST_ROOMS, rooms)
  },

  CREATE_ROOM(ws, { roomSize, roomName, clientName = null }) {
    // Already in a room
    if (ws.roomId) throw new Error('You can not create a room when you already are in one')

    // Create the room
    const roomId = newRoom(roomSize, roomName)
    console.info(`Client uuid=${ws.uuid} created room id=${roomId}`)
    sendMsg(ws, MSG_ID.ROOM_CREATED, { roomId })

    // Propagate a `ROOM_CREATED` event
    eventHandler.ROOM_CREATED(getARoom(roomId), ws.uuid, clientName)

    // Join it
    this.JOIN_ROOM(ws, { roomId, clientName })
  },

  JOIN_ROOM(ws, { roomId, clientName = null }) {
    // Set a random client name if none set
    if (!clientName) clientName = uuid().substring(0, 5)

    // Already in a room
    if (ws.roomId) throw new Error('You can not join a room when you already are in one')

    // Join the room
    joinRoom(roomId, ws.uuid, ws, clientName)
    ws.roomId = roomId
    ws.clientName = clientName
    console.info(`Client uuid=${ws.uuid} joined room id=${ws.roomId}`)
    sendMsg(ws, MSG_ID.ROOM_JOINED, { roomId: roomId })

    // Propagate a `ROOM_JOINED` event
    eventHandler.ROOM_JOINED(getARoom(ws.roomId), ws.uuid, clientName)

    // If the room is full, propagate a `ROOM_READY` event
    if (getRoomRemainingSize(roomId) <= 0)
      eventHandler.ROOM_READY(getARoom(roomId))
  },

  EXIT_ROOM(ws) {
    // Not in a room
    if (!ws.roomId) throw new Error('You can not exit a room when you are not already in one')

    exitRoom(ws.roomId, ws.uuid)
    console.info(`Client name=${ws.clientName} and uuid=${ws.uuid} exited room id=${ws.roomId}`)

    // Propagate a `ROOM_EXITED` event
    eventHandler.ROOM_EXITED(getARoom(ws.roomId), ws.uuid, ws.clientName)

    ws.roomId = null
    ws.clientName = null
    sendMsg(ws, MSG_ID.ROOM_EXITED)
  }
}

// Handle a newly received message
export default (ws, data) => {
  try {
    const json = JSON.parse(data || {})
    console.info(`Received a message from client uuid=${ws.uuid}:\n`, JSON.stringify(json))
    eventHandler.ws.WS_MSG_JSON(json)

    /* eslint-disable */
    switch (json.msgId) {
      case MSG_ID.room.LIST_ROOMS:
        actions.LIST_ROOMS(ws)
        break

      case MSG_ID.room.CREATE_ROOM:
        actions.CREATE_ROOM(ws, json.msg)
        break

      case MSG_ID.room.EXIT_ROOM:
        actions.EXIT_ROOM(ws)
        break

      case MSG_ID.room.JOIN_ROOM:
        actions.JOIN_ROOM(ws, json.msg)
        break
    }
    /* eslint-enable */
  }
  catch (error) {
    console.error(error)
    sendError(ws, MSG_ID.WS_ERROR, error)
    eventHandler.ws.WS_ERROR(error)
  }
}
