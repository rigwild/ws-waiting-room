import uuid from 'uuid/v4'
import { broadcast } from './WebSocket/messageHandler'

/** @typedef {import('./main').Room} Room */
/** @typedef {import('./main').RoomClient} RoomClient */

export class RoomError extends Error { }

/**
 * The object that contains all the server's rooms
 * @type {Object.<string, Room>} Dictionary of rooms identified by its ID
 */
let rooms = {}

/**
 * Check a room exists
 * @param {string} roomId Room id
 * @returns {void}
 * @throws Could not find the room
 */
export const checkRoomExist = roomId => {
  if (!rooms[roomId]) throw new RoomError('Could not find the room')
}

/**
 * Get the list of available rooms
 * @returns {Object} Available rooms (Deep copy without clients)
 */
export const getRooms = () => {
  let clonedRooms = JSON.parse(JSON.stringify(rooms))
  // Remove wsClient from clients in rooms
  // eslint-disable-next-line guard-for-in
  for (const aRoomId in clonedRooms) {
    clonedRooms[aRoomId].clients.forEach((_, i) => {
      delete clonedRooms[aRoomId].clients[i].wsClient
    })
  }
  return clonedRooms
}

// eslint-disable-next-line valid-jsdoc
/**
 * Get a room
 * @param {string} roomId Room id to join
 * @returns {Room} Selected room data
 */
export const getARoom = roomId => {
  checkRoomExist(roomId)
  return rooms[roomId]
}

/**
 * Get the amount of places left for a room
 * @param {string} roomId Room id to join
 * @returns {number} Remaining places
 */
export const getRoomRemainingSize = roomId => {
  checkRoomExist(roomId)
  return rooms[roomId].size - rooms[roomId].clients.length
}

/**
 * Get a room clients
 * @param {string} roomId Room id
 * @returns {RoomClient[]} Room clients
 */
export const getRoomClients = roomId => {
  checkRoomExist(roomId)
  return rooms[roomId].clients
}

/**
 * Get a room WebSocket clients
 * @param {string} roomId Room id
 * @returns {Object[]} Room WebSocket clients
 */
export const getRoomWsClients = roomId => {
  checkRoomExist(roomId)
  return rooms[roomId].clients.map(x => x.wsClient)
}

/**
 * Create a new room
 * @param {number} roomSize Room size (< 0)
 * @param {string} [roomName='No name'] Room name
 * @returns {string} Id of the newly created room
 * @throws Can not create a room with an invalid size
 */
export const newRoom = (roomSize, roomName = 'No name') => {
  if (roomSize <= 0) throw new Error('Can not create a room with an invalid size')
  const roomId = uuid()
  rooms[roomId] = { id: roomId, name: roomName, size: roomSize, clients: [] }
  return roomId
}

/**
 * Join a room
 * @param {string} roomId Room id to join
 * @param {string} clientId Client uuid
 * @param {WebSocket} wsClient WebSocket client to add to the room
 * @param {string} clientName Client pseudo or name
 * @returns {void}
 * @throws The selected room is full
 */
export const joinRoom = (roomId, clientId, wsClient, clientName) => {
  checkRoomExist(roomId)
  if (rooms[roomId].size <= rooms[roomId].clients.length) throw new Error('The selected room is full')

  rooms[roomId].clients.push({ id: clientId, name: clientName, wsClient })
}

/**
 * Exit a room
 * @param {string} roomId Room id to exit
 * @param {string} clientId Client uuid
 * @returns {void}
 */
export const exitRoom = (roomId, clientId) => {
  checkRoomExist(roomId)

  // Exit the room
  const clientIndex = rooms[roomId].clients.findIndex(client => client.id === clientId)
  if (clientIndex !== -1) rooms[roomId].clients.splice(clientIndex, 1)

  // Delete the room if it is empty
  if (rooms[roomId].clients.length - 1 <= 0) delete rooms[roomId]
}

/**
 * Send a message to all clients of a room
 * @param {string} roomId Room's id
 * @param {string} msgId Message ID
 * @param {Object} msg The actual message
 * @returns {void}
 */
export const roomBroadcast = (roomId, msgId, msg) => {
  const clients = getRoomWsClients(roomId)
  broadcast(clients, msgId, msg)
}

export default {
  checkRoomExist,
  getRooms,
  getARoom,
  getRoomRemainingSize,
  getRoomClients,
  getRoomWsClients,
  newRoom,
  joinRoom,
  exitRoom,
  roomBroadcast
}
