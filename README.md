# ws-waiting-room
Easily implement a waiting rooms system using WebSockets 👨‍👩‍👧‍👦 Useful for multiplayer games or instant group chat messaging! 👨🏼‍🔧

A WebSocket-enabled waiting room system. Create rooms, join it and do whatever you want!

https://github.com/websockets/ws/blob/HEAD/doc/ws.md#new-websocketserveroptions-callback

emitter.on('event', () => {
  console.log('an event occurred!')
})

const customLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json(),
    format.splat()
  ),
  defaultMeta: { service: 'ws-waiting-room' },
  transports: [new winston.transports.Console()]
})
