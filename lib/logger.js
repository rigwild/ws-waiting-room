/**
* @typedef {Object} CustomLogger
* @property {Function} logger.log Log message
* @property {Function} logger.info Info message
* @property {Function} logger.error Error message
* @property {Function} logger.warn Warning message
*/

/**
* @returns {CustomLogger} Default logger
*/
const defaultLogger = () => {
  const { log, info, error, warn } = console
  return { log, info, error, warn }
}

class Logger {
  constructor() {
    this.LOGGER = defaultLogger()
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
    else if (!logger && !this.LOGGER) this.LOGGER = defaultLogger()

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
