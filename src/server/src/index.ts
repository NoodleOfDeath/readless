import express from 'express';
import v1router from '@/api/v1';

const app = express();

app.use('/v1', v1router);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});