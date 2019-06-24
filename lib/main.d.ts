// @ts-check
import WebSocket from 'ws'
import { EventEmitter } from 'events'

declare interface RoomClient {
  /** Client ID */
  id: string

  /** Client's name */
  name: string

  /** WebSocket client object */
  wsClient: any
}

declare interface Room {
  /** Room ID */
  id: string

  /** Room's name */
  name: string

  /** Room's available places */
  size: number

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
  * @param {string} roomId Room id
  * @returns {void}
  * @throws Could not find the room
  */
  checkRoomExist(roomId: string): void

  /**
   * Get the list of available rooms
   * @returns {Object} Available rooms (Deep copy without clients)
   */
  getRooms(roomId: string): Object

  /**
   * Get a room
   * @param {string} roomId Room id to join
   * @returns {Room} Selected room data
   */
  getARoom(roomId: string): Room

  /**
   * Get the amount of places left for a room
   * @param {string} roomId Room id to join
   * @returns {number} Remaining places
   */
  getRoomRemainingSize(roomId: string): number

  /**
   * Get a room clients
   * @param {string} roomId Room id
   * @returns {RoomClient[]} Room clients
   */
  getRoomClients(roomId: string): RoomClient[]

  /**
   * Get a room WebSocket clients
   * @param {string} roomId Room id
   * @returns {Object[]} Room WebSocket clients
   */
  getRoomWsClients(roomId: string): Object[]

  /**
   * Create a new room
   * @param {number} roomSize Room size (< 0)
   * @param {string} [roomName='No name'] Room name
   * @returns {string} Id of the newly created room
   * @throws Can not create a room with an invalid size
   */
  newRoom(roomSize: number, roomName: string): string

  /**
   * Join a room
   * @param {string} roomId Room id to join
   * @param {string} clientId Client uuid
   * @param {WebSocket} wsClient WebSocket client to add to the room
   * @param {string} clientName Client pseudo or name
   * @returns {void}
   * @throws The selected room is full
   */
  joinRoom(roomId: string, clientId: string, wsClient: WebSocket, clientName: string): void

  /**
   * Exit a room
   * @param {string} roomId Room id to exit
   * @param {string} clientId Client uuid
   * @returns {void}
   */
  exitRoom(roomId: string, clientId: string): void

  /**
   * Send a message to all clients of a room
   * @param {string} roomId Room's id
   * @param {string} msgId Message ID
   * @param {Object} msg The actual message
   * @returns {void}
   */
  roomBroadcast(roomId: string, msgId: string, msg: Object): void
}

declare interface WsWaitingRoomClient extends WebSocket {
  /** Unique client identifier */
  uuid: string

  /** The room ID the client is currently in */
  roomId?: string
}

declare interface WsWaitingRoom {
  /** Start the server */
  startServer(wsOptions: WebSocket.ServerOptions, logger?: import('./logger').CustomLogger): WebSocket.Server

  /** List of messages ID */
  msgId: { room: Object, ws: Object }

  /** Rooms handler */
  roomHandler: RoomHandler

  /** Events emitter */
  eventEmitter: WsWaitingRoomEventEmitter
}
