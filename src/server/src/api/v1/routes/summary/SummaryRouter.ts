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
  rateLimitMiddleware('20 per 1m'),
  query('filter').isString().optional(),
  query('ids').optional(),
  query('excludeIds').isBoolean().optional(),
  query('matchType').isString().matches(/^(?:any|all)$/).optional(),
  query('interval').isString().matches(/^\d+(?:d(?:ays?)?|h(?:ours?)?|m(?:in(?:utes?)?)?|w(?:eeks?)?|month|y(?:ears?)?)$/i).optional(),
  query('locale').isString().optional(),
  query('start').isString().optional(),
  query('end').isString().optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    try {
      const params = SummaryController.serializeParams(req.query);
      params.version = JSON.stringify(req?.headers['x-app-version'] || '1.11.0');
      const response = await SummaryController.getSummariesInternal(params);
      return res.json(response);
    } catch (err) {
      internalErrorHandler(res, err);
    }
  }
);

router.get(
  '/topics',
  rateLimitMiddleware('20 per 1m'),
  query('filter').isString().optional(),
  query('ids').optional(),
  query('excludeIds').isBoolean().optional(),
  query('matchType').isString().matches(/^(?:any|all)$/).optional(),
  query('interval').isString().matches(/^\d+(?:d(?:ays?)?|h(?:ours?)?|m(?:in(?:utes?)?)?|w(?:eeks?)?|month|y(?:ears?)?)$/i).optional(),
  query('locale').isString().optional(),
  query('start').isString().optional(),
  query('end').isString().optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    try {
      const params = SummaryController.serializeParams(req.query);
      params.version = JSON.stringify(req?.headers['x-app-version'] || '1.11.0');
      const response = await SummaryController.getTopicsInternal(params);
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

router.get(
  '/recap',
  rateLimitMiddleware('20 per 1m'),
  query('filter').isString().optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    try {
      const {
        filter, page, pageSize, 
      } = req.params;
      const response = await SummaryController.getRecaps(req, filter, pageSize, page);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
