import { body } from 'express-validator';

export const createContributionValidator = [
  body('userId')
    .isInt({ gt: 0 })
    .withMessage('Valid userId is required'),

  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than zero'),

  body('currency')
    .notEmpty()
    .withMessage('Currency is required'),

  body('type')
    .optional()
    .isString()
    .withMessage('Type must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];
