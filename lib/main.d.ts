// @ts-check
import { ServerOptions } from 'ws'
import { EventEmitter } from 'events'

declare interface RoomClient {
  /** Client ID */
  id: String

  /** Client's name */
  name: String

  /** WebSocket client object */
  wsClient: WebSocket
}

declare interface Room {
  /** Room ID */
  id: String

  /** Room's name */
  name: String

  /** Room's available places */
  size: Number

  /** Room's clients */
  clients: RoomClient[]
}

declare interface WsWaitingRoomEventEmitter extends EventEmitter {
  on(event: 'ROOM_CREATED', listener: (room: Room, clientId: string, clientName: string) => void): this
  on(event: 'ROOM_EXITED', listener: (room: Room, clientId: string, clientName: string) => void): this
  on(event: 'ROOM_JOINED', listener: (room: Room, clientId: string, clientName: string) => void): this
  on(event: 'ROOM_READY', listener: (room: Room) => void): this
  on(event: 'ROOM_ERROR', listener: (...obj: any) => void): this
  on(event: 'WS_MSG', listener: (msg: string) => void): this
  on(event: 'WS_MSG_JSON', listener: (msg: Object) => void): this
  on(event: 'WS_ERROR', listener: (error: Error) => void): this
  on(event: string, listener: never): never
}

declare interface RoomHandler {
  /**
  * Check a room exists
  * @param {String} roomId Room id
  * @returns {void}
  * @throws Could not find the room
  */
  checkRoomExist(roomId: String): void

  /**
   * Get the list of available rooms
   * @returns {Object} Available rooms (Deep copy without clients)
   */
  getRooms(roomId: String): Object

  /**
   * Get a room
   * @param {String} roomId Room id to join
   * @returns {Room} Selected room data
   */
  getARoom(roomId: String): Room

  /**
   * Get the amount of places left for a room
   * @param {String} roomId Room id to join
   * @returns {Number} Remaining places
   */
  getRoomRemainingSize(roomId: String): Number

  /**
   * Get a room clients
   * @param {String} roomId Room id
   * @returns {RoomClient[]} Room clients
   */
  getRoomClients(roomId: String): RoomClient[]

  /**
   * Get a room WebSocket clients
   * @param {String} roomId Room id
   * @returns {Object[]} Room WebSocket clients
   */
  getRoomWsClients(roomId: String): Object[]

  /**
   * Create a new room
   * @param {Number} roomSize Room size (< 0)
   * @param {String} [roomName='No name'] Room name
   * @returns {String} Id of the newly created room
   * @throws Can not create a room with an invalid size
   */
  newRoom(roomSize: Number, roomName: String): String

  /**
   * Join a room
   * @param {String} roomId Room id to join
   * @param {String} clientId Client uuid
   * @param {WebSocket} wsClient WebSocket client to add to the room
   * @param {String} clientName Client pseudo or name
   * @returns {void}
   * @throws The selected room is full
   */
  joinRoom(roomId: String, clientId: String, wsClient: WebSocket, clientName: String): void

  /**
   * Exit a room
   * @param {String} roomId Room id to exit
   * @param {String} clientId Client uuid
   * @returns {void}
   */
  exitRoom(roomId: String, clientId: String): void

  /**
   * Send a message to all clients of a room
   * @param {String} roomId Room's id
   * @param {String} msgId Message ID
   * @param {Object} msg The actual message
   * @returns {void}
   */
  roomBroadcast(roomId: String, msgId: String, msg: Object): void
}

declare interface WsWaitingRoom {
  /** Start the server */
  startServer(wsOptions: ServerOptions, logger: import('./logger').CustomLogger): WebSocket.Server

  /** List of messages ID */
  msgId: { room: Object, ws: Object }

  /** Rooms handler */
  roomHandler: RoomHandler

  /** Events emitter */
  eventEmitter: WsWaitingRoomEventEmitter
}
