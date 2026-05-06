const { createLogger, format, transports } = require("winston");

const myFormat = format.printf(({ level, message, label, timestamp, ...meta }) => {
  const formattedMessage =
    typeof message === "string" ? message : JSON.stringify(message);
  const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
  return `${timestamp} [${label}] [${level}]: ${formattedMessage}${metaStr}`;
});

const logger = createLogger({
  format: format.combine(
    format.label({ label: "BFF" }),
    format.timestamp({ format: " YYYY-MM-DD HH:mm:ss.SSSZZ " }),
    format.json(),
    myFormat
  ),
  transports: [new transports.Console()],
});

//export default logger;
module.exports = { logger };
