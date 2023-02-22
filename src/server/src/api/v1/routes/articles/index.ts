import { Router } from 'express';
import { param } from 'express-validator';

import { pagination, validate } from '../../middleware';

import { ArticleController } from './../../controllers';
import { ArticleAttributes } from '../../../../schema/v1/models';

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
    const { pageSize = 10, page = 0, offset = 0 } = req.query;
    const controller = new ArticleController();
    let response: ArticleAttributes[] = [];
    if (category && subcategory && title) {
      response = [
        await controller.getArticleForCategoryAndSubcategoryAndTitle(
          category,
          subcategory,
          title,
          pageSize,
          page,
          offset,
        ),
      ];
    } else if (category && subcategory) {
      response = await controller.getArticlesForCategoryAndSubcategory(category, subcategory, pageSize, page, offset);
    } else if (category) {
      response = await controller.getArticlesForCategory(category, pageSize, page, offset);
    } else {
      response = await controller.getArticles(pageSize, page, offset);
    }
    res.json(response);
  },
);

export default router;
