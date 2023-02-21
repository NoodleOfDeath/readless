import { query } from 'express-validator';

export const pagination = [
  query('pageSize').isNumeric().optional(),
  query('page').isNumeric().optional(),
  query('offset').if(query('page').not().exists()).isNumeric().optional().default(0),
];
