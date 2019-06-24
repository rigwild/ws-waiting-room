import createWsServer from './WebSocket'
import { emitter } from './eventHandler'
import roomHandler from './roomHandler'
import msgId from './msgId.config'

/**
 * @type {import('./main').WsWaitingRoom}
 */
const exported = {
  startServer: createWsServer,
  msgId,
  roomHandler,
  eventEmitter: emitter
}

export default exported
