import createWsServer from './WebSocket'
import { getEmitter } from './eventHandler'

let exported = getEmitter()
exported.startServer = createWsServer

export default exported
