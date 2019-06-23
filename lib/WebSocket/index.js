import WebSocket from 'ws'
import uuid from 'uuid/v4'

import { wsHostname, wsPort, wsPath } from '../../config'
import messageHandler, { actions, sendError } from './messageHandler'
import eventHandler from '../eventHandler'
import MSG_ID from '../../msgId.config'

/**
 * Create the WebSocket server
 * @param {Object} [wsOptions = {}] `ws` server library options @see https://github.com/websockets/ws/blob/HEAD/doc/ws.md#new-websocketserveroptions-callback
 * @returns {void}
 */
const createWsServer = async (wsOptions = {}) => {
  const wss = new WebSocket.Server(wsOptions)

  wss.on('listening', () => console.info(`The WebSocket server was started at ws://${wsHostname}:${wsPort}${wsPath}`))
  wss.on('error', err => console.error(err))

  wss.on('connection', ws => {
    // Identify the connection
    ws.uuid = uuid()

    console.info('New client connected, uuid=' + ws.uuid)

    ws.on('message', data => {
      messageHandler(ws, data)
      eventHandler.ws.WS_MSG(data)
    })
    ws.on('error', error => {
      sendError(ws, MSG_ID.WS_ERROR, error)
      eventHandler.ws.WS_ERROR(error)
    })
    ws.on('close', () => {
      console.info('Client disconnected. uuid=' + ws.uuid)
      // Exit the room if any
      if (ws.roomId) actions.EXIT_ROOM(ws)
    })
  })
}

export default createWsServer
