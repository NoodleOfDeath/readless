import { Router } from 'express';
import { param } from 'express-validator';
import { pagination, validate } from '../../middleware';

import { Article } from '../../../../schema/v1/models';

const router = Router();

router.get(
  '/:category?/:subcategory?/:title?',
  param('category').isString().optional(),
  param('subcategory').isString().optional(),
  param('title').isString().optional(),
  ...pagination,
  validate,
  async (req, res) => {
    const { category, subcategory, title } = req.params;
    const { pageSize = 10, offset = 0 } = req.query;

    const options: Record<string, unknown> = {
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    };
    const filters: Record<string, string> = {};
    if (title) filters.title = title;
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (Object.keys(filters).length > 0) {
      options.where = filters;
    }
    const articles = await Article.findAndCountAll(options);
    res.json({ data: articles.rows });
  },
);

export default router;
