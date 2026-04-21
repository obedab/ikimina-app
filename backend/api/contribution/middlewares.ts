import { FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../../utils/response";
import { ApiError } from "../types/apiResponse";
import { JwtPayload } from "../types/auth";

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

    return sendError(res, "Validation failed", 422, formattedErrors);
  }

  next();
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return sendError(res, "Unauthorized: No token provided", 401);
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return sendError(res, "Unauthorized: Invalid token format", 401);
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)  as JwtPayload;

    req.user  = decoded ;

    next();
  } catch {
    return sendError(res, "Unauthorized: Invalid or expired token", 401);
  }
};
