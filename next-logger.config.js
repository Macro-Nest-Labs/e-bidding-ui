// next-logger.config.js
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || 'error';

const pino = require('pino');

const logger = (defaultConfig) =>
  pino({
    ...(defaultConfig || {}),
    level: logLevel,
    messageKey: 'message',
    timestamp() {
      return `,"time":"${new Date(Date.now()).toISOString()}"`;
    },
    formatters: {
      level(label) {
        return { level: String(label).toUpperCase() };
      },
    },
  });

module.exports = { logger };
