import { ApiResponse, ApiError } from "../api/types/apiResponse";
import {  Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    errors: null,
  };

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: ApiError[] | null = null
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
  };

  return res.status(statusCode).json(response);
};
