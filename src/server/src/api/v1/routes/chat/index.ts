import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../../middleware';
import { ChatGPTService } from '../../../../services';

const router = Router();

router.post(
  '/',
  param('message').isString(),
  param('cid').isString().optional(),
  param('pid').isString().optional(),
  validate,
  async (req, res) => {
    const message = String(req.params.message);
    const conversationId = String(req.params.cid);
    const parentMessageId = String(req.params.pid);
    const chatgpt = new ChatGPTService();
    try {
      const reply = await chatgpt.send(message, {
        conversationId,
        parentMessageId,
      });
      res.send(reply);
    } catch (e) {
      res.status(500).send('Internal Error');
    }
  },
);

export default router;
