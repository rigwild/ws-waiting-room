import createWsServer from './lib'

console.log('Starting the WebSocket server...')
createWsServer({ host: 'localhost', port: 1337, path: '/ws' })
