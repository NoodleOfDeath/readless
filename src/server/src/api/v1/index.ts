import { Router } from 'express';

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

export default router;