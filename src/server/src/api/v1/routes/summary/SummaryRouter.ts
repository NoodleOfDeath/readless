import { Router } from 'express';
import {
  body,
  param,
  query,
} from 'express-validator';

import { BulkResponse, SummaryResponse } from './../../schema/types';
import { SummaryController } from '../../controllers';
import {
  authMiddleware,
  paginationMiddleware,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

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
    let response: BulkResponse<SummaryResponse> | SummaryResponse = {
      count: 0,
      rows: [],
    };
    try {
      if (category && subcategory && title) {
        response = await SummaryController.getSummaryForCategoryAndSubcategoryAndTitle(category, subcategory, title);
      } else if (category && subcategory) {
        response = await SummaryController.getSummariesForCategoryAndSubcategory(
          category,
          subcategory,
          filter,
          pageSize,
          page,
          offset
        );
      } else if (category) {
        response = await SummaryController.getSummariesForCategory(category, filter, pageSize, page, offset);
      } else {
        response = await SummaryController.getSummaries(filter, pageSize, page, offset);
      }
      res.json(response);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
);

router.post(
  '/interact/:targetId/:type',
  rateLimitMiddleware('1 per 2s'),
  authMiddleware('jwt', { required: true, scope: ['standard:write'] }),
  param('targetId').isNumeric(),
  param('type').isString(),
  body('value').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { targetId, type } = req.params;
      await SummaryController.interactWithSummary(targetId, type, req.body);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
);

export default router;
