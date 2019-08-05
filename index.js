import wsRoomServer from './lib'

console.log('Starting the WebSocket server...')
wsRoomServer.startServer({ host: 'localhost', port: 1337, path: '/ws' })


wsRoomServer.eventEmitter.on('ROOM_CREATED', (...args) => {
  console.log(...args)
  console.log('TRIGGERED THE EVENT `ROOM_CREATED`')
})

wsRoomServer.eventEmitter.on('ROOM_JOINED', (...args) => {
  console.log(...args)
  console.log('TRIGGERED THE EVENT `ROOM_JOINED`')
})
wsRoomServer.eventEmitter.on('ROOM_CREATEDefz', () => {
  console.log('fzef')
})
