import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { pagination, rateLimit, validate } from '../../middleware';

import { SourceController } from '../../controllers';
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
    try {
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
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Error');
    }
  },
);

router.post('/', rateLimit('2 per 1 min'), body('url').isURL(), validate, async (req, res) => {
  const controller = new SourceController();
  try {
    const source = await controller.postReadAndSummarizeSource(req.body);
    res.json(source);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Error');
  }
});

export default router;
