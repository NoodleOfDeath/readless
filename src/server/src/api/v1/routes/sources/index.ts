import { Router } from 'express';
import { body, param } from 'express-validator';

import { pagination, referralHandler, validate } from '../../middleware';

import { SourceController } from './../../controllers/sources';
import { SourceAttr, SourceAttributes } from '../../../../schema/v1/models';

const router = Router();

router.get(
  '/:category?/:subcategory?/:title?',
  referralHandler,
  param('category').isString().optional(),
  param('subcategory').isString().optional(),
  param('title').isString().optional(),
  ...pagination,
  validate,
  async (req, res) => {
    const { category, subcategory, title } = req.params;
    const { pageSize = 10, page = 0, offset = page * pageSize } = req.query;
    const controller = new SourceController();
    let response: SourceAttr[] | SourceAttributes = [];
    if (category && subcategory && title) {
      response = await controller.getSourceForCategoryAndSubCategoryAndTitle(
        category,
        subcategory,
        title,
        pageSize,
        page,
        offset,
      );
    } else if (category && subcategory) {
      response = await controller.getSourcesForCategoryAndSubCategory(category, subcategory, pageSize, page, offset);
    } else if (category) {
      response = await controller.getSourcesForCategory(category, pageSize, page, offset);
    } else {
      response = await controller.getSources(pageSize, page, offset);
    }
    res.json(response);
  },
);

router.post('/', body('url').isString(), validate, async (req, res) => {
  const { url } = req.body;
  const controller = new SourceController();
  const source = await controller.readAndSummarizeSource(url);
  res.json(source);
});

export default router;
