import wsRoom from './lib'


console.log('Starting the WebSocket server...')
wsRoom.startServer({ host: 'localhost', port: 1337, path: '/ws' })
