import { Router } from 'express';

export const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/healthz', (req, res) => {
  res.send('OK');
});
