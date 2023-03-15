import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';

import { rateLimit } from './v1/middleware';
import v1router from './v1';

const app = express();

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: () => {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  }),
);

app.use(cors({ origin: new RegExp(process.env.CORS_ORIGIN, 'i') }));

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: process.env.REQ_SIZE_LIMIT,
  }),
);

app.use(
  bodyParser.json({ limit: process.env.REQ_SIZE_LIMIT }),
);

app.set('trust proxy', 1);

app.use(rateLimit('120 per 1 min'));
app.use('/v1', v1router);

app.use('*', (_, res) => {
  res.status(404).json({ message: 'Bad Request' });
});

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  }),
);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
