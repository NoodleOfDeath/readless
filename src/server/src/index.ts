import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import v1router from './api/v1';

const app = express();

app.use(cors({ origin: new RegExp(process.env.CORS_ORIGIN, 'i') }));

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: process.env.REQ_SIZE_LIMIT,
  }),
);

app.use(
  bodyParser.json({
    limit: process.env.REQ_SIZE_LIMIT,
  }),
);

app.set('trust proxy', 1);

app.use('/v1', v1router);

app.use('*', (_, res) => {
  res.status(404).json({ message: 'Bad Request' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
