import { Router } from 'express';
import { param, query } from 'express-validator';

import { ArticleController } from '../../controllers';
import { pagination, validate } from '../../middleware';
import { ArticleAttr, ArticleAttributes } from '../../schema/types';

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
      filter, pageSize = 10, page = 0, offset = 0, 
    } = req.query;
    const controller = new ArticleController();
    let response: { count: number; rows: ArticleAttr[] } | ArticleAttributes = {
      count: 0,
      rows: [],
    };
    try {
      if (category && subcategory && title) {
        response = await controller.getArticleForCategoryAndSubcategoryAndTitle(category, subcategory, title);
      } else if (category && subcategory) {
        response = await controller.getArticlesForCategoryAndSubcategory(
          category,
          subcategory,
          filter,
          pageSize,
          page,
          offset
        );
      } else if (category) {
        response = await controller.getArticlesForCategory(category, filter, pageSize, page, offset);
      } else {
        response = await controller.getArticles(filter, pageSize, page, offset);
      }
      res.json(response);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
);

export default router;
