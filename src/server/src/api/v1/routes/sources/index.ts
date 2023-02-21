import { Router } from 'express';
import { param } from 'express-validator';

import { pagination, validate } from '../../middleware';

import { Source } from '../../../../schema/v1/models';
import { FindAndCountOptions } from '../../../../schema/v1/models/types';

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
    const { pageSize = 10, page = 0, offset = page * pageSize } = req.query;

    const options: FindAndCountOptions<Source> = {
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
    const sources = await Source.findAndCountAll(options);
    res.json({ data: sources.rows });
  },
);

export default router;
