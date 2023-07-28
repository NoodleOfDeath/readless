import { RequestHandler } from 'express';

import { GoogleService } from '../../../services/google/GoogleService';

export const GoogleMeasurementMiddleware: RequestHandler = async (req, res, next) => {
  try {
    await GoogleService.collectMetric({
      client_id: JSON.stringify(req.get('x-uuid') || [req.get('user-agent'), req.ip].join('-')),
      events: [{
        name: 'api_request',
        params: {
          page_location: req.originalUrl,
          page_path: req.path,
        },
      }],
    });
  } catch (e) {
    console.error(e);
  }
  next();
};
