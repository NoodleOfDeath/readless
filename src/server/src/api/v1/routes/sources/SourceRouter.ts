import { Router } from 'express';
import { param, query } from 'express-validator';

import { SourceController } from '../../controllers';
import { SourceAttr, SourceAttributes } from '../../schema/models';
import { pagination, validate } from '../../middleware';

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
    const {
      category, subcategory, title, 
    } = req.params;
    const {
      filter, pageSize = 10, page = 0, offset = page * pageSize, 
    } = req.query;
    const controller = new SourceController();
    let response: { count: number; rows: SourceAttr[] } | SourceAttributes = {
      count: 0,
      rows: [],
    };
    try {
      if (category && subcategory && title) {
        response = await controller.getSourceForCategoryAndSubcategoryAndTitle(category, subcategory, title);
      } else if (category && subcategory) {
        response = await controller.getSourcesForCategoryAndSubcategory(
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
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

export default router;
