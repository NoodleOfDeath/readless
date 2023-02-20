import { Source } from '../../../../schema/v1/models';
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware';

const router = Router();

router.post('/', body('url').isString(), validate, async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url);
    const source = new Source({ url });
    source.save();
    res.send(source.createdAt);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
