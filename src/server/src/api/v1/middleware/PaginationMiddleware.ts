import { query } from 'express-validator';

export const paginationMiddleware = [
  query('pageSize').isNumeric().optional(),
  query('page').isNumeric().optional(),
  query('offset').if(query('page').not().exists()).isNumeric().optional().default(0),
  query('order').optional(),
];
