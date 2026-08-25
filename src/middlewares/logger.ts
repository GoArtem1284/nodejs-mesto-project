import winston from 'winston';
import expressWinston from 'express-winston';

export const requestLogger = expressWinston.logger({
  transports : [new winston.transports.File({ filename : 'requests.log'})],
  format : winston.format.json()
})

export const errorLogger = expressWinston.errorLogger({
  transports : [new winston.transports.File({ filename : 'errorse.log'})],
  format : winston.format.json()
})