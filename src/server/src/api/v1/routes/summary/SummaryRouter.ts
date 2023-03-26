import { Router } from 'express';
import {
  body,
  param,
  query,
} from 'express-validator';

import { BulkResponse, SummaryResponse } from './../../schema/types';
import { AuthError } from '../../../../services';
import { SummaryController } from '../../controllers';
import {
  authMiddleware,
  internalErrorHandler,
  paginationMiddleware,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/:category?/:subcategory?/:title?',
  authMiddleware('jwt'),
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
      filter, pageSize = 10, page = 0, offset = page * pageSize, userId: userIdStr,
    } = req.query;
    const userId = !Number.isNaN(parseInt(userIdStr)) ? parseInt(userIdStr) : undefined;
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
          userId,
          filter,
          pageSize,
          page,
          offset
        );
      } else if (category) {
        response = await SummaryController.getSummariesForCategory(category, userId, filter, pageSize, page, offset);
      } else {
        response = await SummaryController.getSummaries(userId, filter, pageSize, page, offset);
      }
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
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
      const interactions = await SummaryController.interactWithSummary(targetId, type, req.body);
      return res.json(interactions);
    } catch (e) {
      if (e instanceof AuthError) {
        return res.status(401).json(e);
      }
      internalErrorHandler(res, e);
    }
  }
);

export default router;
