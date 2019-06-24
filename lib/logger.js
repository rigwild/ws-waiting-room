/**
* @typedef {Object} CustomLogger
* @property {Function} logger.log Log message
* @property {Function} logger.info Info message
* @property {Function} logger.error Error message
* @property {Function} logger.warn Warning message
*/

class Logger {
  constructor() {
    /**
     * @type {CustomLogger}
     */
    this.LOGGER = console
  }

  /**
   * Set the server logger
   * Can be a `winston` logger configuration @see https://www.npmjs.com/package/winston
   *
   * @param {CustomLogger} [logger] Any logger provided by the user
   * @returns {CustomLogger} The logger
   */
  setLogger(logger) {
    // Overwrite the current logger
    if (logger) this.LOGGER = logger

    // No logger configuration provided, set the default one
    else if (!logger && !this.LOGGER) this.LOGGER = console

    return this.LOGGER
  }

  log() {
    this.LOGGER.log(...arguments)
  }
  info() {
    this.LOGGER.info(...arguments)
  }
  error() {
    this.LOGGER.error(...arguments)
  }
  warn() {
    this.LOGGER.warn(...arguments)
  }
}

const logger = new Logger()

export default logger
