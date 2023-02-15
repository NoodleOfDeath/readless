import express from 'express';
import { router } from './v1';

const app = express();

app.use('/v1', router);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});