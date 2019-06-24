import WebSocket from 'ws'
import uuid from 'uuid/v4'

import messageHandler, { actions, sendError } from './messageHandler'
import eventHandler from '../eventHandler'
import MSG_ID from '../msgId.config'
import LOGGER from '../logger'

// eslint-disable-next-line valid-jsdoc
/**
 * Create the WebSocket server
 * @param {import('ws').ServerOptions} [wsOptions = {}] `ws` server library options @see https://github.com/websockets/ws/blob/HEAD/doc/ws.md#new-websocketserveroptions-callback
 * @param {import('../logger').CustomLogger} [logger] A logger configuration, use a default if ommited
 * @returns {WebSocket.Server} The create WebSocket server
 */
const createWsServer = (wsOptions = {}, logger) => {
  // Load the custom logger in the logger handler
  LOGGER.setLogger(logger)

  const wss = new WebSocket.Server(wsOptions)

  wss.on('listening', () => LOGGER.info(`The WebSocket server was started at ws://${wss.options.host}:${wss.options.port}${wss.options.path}`))
  wss.on('error', err => LOGGER.error(err))

  wss.on('connection',
    // eslint-disable-next-line valid-jsdoc
    /**
     * @param {import('../main').WsWaitingRoomClient} ws Connected WebSocket client
     * @returns {void}
     */
    ws => {
      // Identify the connection
      ws.uuid = uuid()

      LOGGER.info('New client connected, uuid=' + ws.uuid)

      ws.on('message', data => {
        messageHandler(ws, data)
        eventHandler.WS_MSG(data)
      })
      ws.on('error', error => {
        sendError(ws, MSG_ID.ws.WS_ERROR, error)
        eventHandler.WS_ERROR(error)
      })
      ws.on('close', () => {
        LOGGER.info('Client disconnected. uuid=' + ws.uuid)
        // Exit the room if any
        if (ws.roomId) actions.EXIT_ROOM(ws)
      })
    })

  return wss
}

export default createWsServer
