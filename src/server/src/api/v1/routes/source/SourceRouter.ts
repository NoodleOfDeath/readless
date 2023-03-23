import { Router } from 'express';
import { param, query } from 'express-validator';

import { SourceController } from '../../controllers';
import { paginationMiddleware, validationMiddleware } from '../../middleware';
import { SourceAttrRaw, SourceAttributesRaw } from '../../schema/types';

const router = Router();

router.get(
  '/:category?/:subcategory?/:title?',
  param('category').isString().optional(),
  param('subcategory').isString().optional(),
  param('title').isString().optional(),
  query('filter').isString().optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    const {
      category, subcategory, title, 
    } = req.params;
    const {
      filter, pageSize = 10, page = 0, offset = page * pageSize, 
    } = req.query;
    const controller = new SourceController();
    let response: { count: number; rows: SourceAttrRaw[] } | SourceAttributesRaw = {
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
          offset
        );
      } else if (category) {
        response = await controller.getSourcesForCategory(category, filter, pageSize, page, offset);
      } else {
        response = await controller.getSources(filter, pageSize, page, offset);
      }
      res.json(response);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
);

export default router;
