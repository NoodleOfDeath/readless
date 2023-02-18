import { Router } from 'express';
import { ChatGPTService } from '@/services';

const router = Router();

router.get('/healthz', (req, res) => {
  res.send('OK');
});

router.get('/login', (req, res) => {
  const email = req.query.email;
  const passwd = req.query.passwd;
  if (!email && !passwd) {
    res.send("Bad Request");
  } else if (passwd !== "passwd") {
    res.send("Email or password incorrect");
  } else {
    res.send("Welcome Back!");
  }
});

router.get('/chat', (req, res) => {
  const message = req.query.message;
  if (!message) {
    res.send("Bad Request");
  }
  ChatGPTService.default.send(message)
    .then((r) => res.send(r))
    .catch((r) => res.status(500).send("Internal Error"));
});

export default router;