import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

import path from 'path';

const { combine, timestamp, json } = winston.format;
const format = combine(timestamp(), json());

const logs = path.join(__dirname, '../logs');

const requestTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logs, 'request-%DATE%.log'),
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '3d',
});
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    requestTransport,
  ],
  format,
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logs, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '3d',
});
export const errorLogger = expressWinston.errorLogger({
  transports: [errorTransport],
  format,
});
