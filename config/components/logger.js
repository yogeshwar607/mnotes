const winston = require('winston');

winston.emitErrs = true;

const logger = new winston.Logger({

  transports: [
    // new winston.transports.File({
    //   level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    //   filename: './logs/all-logs.log',
    //   handleExceptions: false,
    //   json: true,
    //   maxsize: 1242880, // 1MB
    //   maxFiles: 5,
    //   colorize: false,
    // }),
    new winston.transports.Console({
      level: process.env.LOGGER_LEVEL || 'info',
      handleExceptions: false,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;

module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};