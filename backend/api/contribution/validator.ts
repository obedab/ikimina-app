import { body, query, param } from 'express-validator';

export const createContributionValidator = [
  body('userId')
    .isInt()
    .withMessage('userId must be a number'),

  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('amount must be greater than 0'),
];

export const getByConditionValidator = [
  query('userId')
    .optional()
    .isInt()
    .withMessage('userId must be a number'),
];

export const getOneValidator = [
  param('id')
    .isInt()
    .withMessage('id must be a number'),
];
