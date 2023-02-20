import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../../middleware';

import { Article } from '../../../../schema/v1/models';

const router = Router();

router.get(
  '/:category?/:subcategory?/:title?',
  param('category').isString().optional(),
  param('subcategory').isString().optional(),
  param('title').isString().optional(),
  validate,
  async (req, res) => {
    const category = String(req.params.category);
    const subcategory = String(req.params.subcategory);
    const title = String(req.params.title);
    const filters: Record<string, string> = {};
    if (title) filters.title = title;
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    const articles =
      Object.keys(filters).length > 0 ? await Article.findAll({ where: filters }) : await Article.findAll();
    res.json(articles);
  },
);

export default router;
