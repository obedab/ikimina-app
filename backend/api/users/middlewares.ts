import { FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../../utils/response";
import { ApiError } from "../types/apiResponse";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: ApiError[] = errors.array().map((err) => {
      const fieldError = err as FieldValidationError;
      
      return {
        field: fieldError.path,
        message: fieldError.msg as string,

      };
      });

    return sendError(res, "validation failed", 422, formattedErrors);
  }
  next();
};
