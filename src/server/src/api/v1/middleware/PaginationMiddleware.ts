import { query } from 'express-validator';

export const paginationMiddleware = [
  query('pageSize').isNumeric().optional(),
  query('page').isNumeric().optional(),
  query('offset').if(query('page').not().exists()).isNumeric().optional().default(0),
  query('order').optional().customSanitizer((value) => {
    if (typeof value === 'string') {
      return [value];
    }
    if (!(Array.isArray(value) && value.every((item) => typeof item === 'string' && /:/.test(item)))) {
      return null;
    }
  }),
];
