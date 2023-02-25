import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { pagination, validate } from '../../middleware';

import { SourceController } from './../../controllers/sources';
import { SourceAttr, SourceAttributes } from '../../schema';

const router = Router();

router.get(
  '/:category?/:subcategory?/:title?',
  param('category').isString().optional(),
  param('subcategory').isString().optional(),
  param('title').isString().optional(),
  query('filter').isString().optional(),
  ...pagination,
  validate,
  async (req, res) => {
    const { category, subcategory, title } = req.params;
    const { filter, pageSize = 10, page = 0, offset = page * pageSize } = req.query;
    const controller = new SourceController();
    let response: SourceAttr[] | SourceAttributes = [];
    if (category && subcategory && title) {
      response = await controller.getSourceForCategoryAndSubCategoryAndTitle(category, subcategory, title);
    } else if (category && subcategory) {
      response = await controller.getSourcesForCategoryAndSubCategory(
        category,
        subcategory,
        filter,
        pageSize,
        page,
        offset,
      );
    } else if (category) {
      response = await controller.getSourcesForCategory(category, filter, pageSize, page, offset);
    } else {
      response = await controller.getSources(filter, pageSize, page, offset);
    }
    res.json(response);
  },
);

router.post('/', body('url').isURL(), validate, async (req, res) => {
  const controller = new SourceController();
  const source = await controller.readAndSummarizeSource(req.body);
  res.json(source);
});

export default router;
