import { Router } from 'express';
import {
  body,
  param,
  query,
} from 'express-validator';

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
  '/',
  rateLimitMiddleware('15 per 1m'),
  query('scope').isString().matches(/^(?:conservative|public)$/).optional(),
  query('filter').isString().optional(),
  query('ids').optional(),
  query('excludeIds').isBoolean().optional(),
  query('matchType').isString().matches(/^(?:any|all)$/).optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    const {
      scope, filter, ids, excludeIds: exclude, pageSize = 10, page = 0, offset = page * pageSize, userId: userIdStr, order, matchType,
    } = req.query;
    const userId = !Number.isNaN(parseInt(userIdStr)) ? parseInt(userIdStr) : undefined;
    const excludeIds = exclude === 'false' || exclude === 0 || exclude === 'undefined' ? false : exclude;
    try {
      const response = await SummaryController.getSummaries(userId, scope, filter, ids, excludeIds, matchType, pageSize, page, offset, order);
      return res.json(response);
    } catch (err) {
      internalErrorHandler(res, err);
    }
  }
);

router.get(
  '/trends',
  rateLimitMiddleware('15 per 1m'),
  query('type').isString().optional(),
  query('interval').isString().optional(),
  query('min').isNumeric().optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    const {
      type, interval, min = 0, pageSize = 10, page = 0, offset = page * pageSize, userId: userIdStr, order,
    } = req.query;
    const userId = !Number.isNaN(parseInt(userIdStr)) ? parseInt(userIdStr) : undefined;
    try {
      const response = await SummaryController.getTrends(userId, type, interval, min, pageSize, page, offset, order);
      return res.json(response);
    } catch (err) {
      internalErrorHandler(res, err);
    }
  }
);

router.post(
  '/interact/:targetId/:type',
  rateLimitMiddleware('1 per 2s'),
  param('targetId').isNumeric(),
  param('type').isString(),
  body('value').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { targetId, type } = req.params;
      req.body.remoteAddr = req.ip;
      const interactions = await SummaryController.interactWithSummary(targetId, type, req.body);
      return res.json(interactions);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.delete(
  '/:targetId',
  rateLimitMiddleware('1 per 10s'),
  authMiddleware('jwt', { required: true, scope: ['god:*'] }),
  param('targetId').isNumeric(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { targetId } = req.params;
      const response = await SummaryController.destroySummary(targetId, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.patch(
  '/restore/:targetId',
  rateLimitMiddleware('1 per 10s'),
  authMiddleware('jwt', { required: true, scope: ['god:*'] }),
  param('targetId').isNumeric(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { targetId } = req.params;
      const response = await SummaryController.restoreSummary(targetId, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
