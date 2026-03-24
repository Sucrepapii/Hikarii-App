import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        return res.status(400).json({
          error: errorMessage || "Validation error",
          details: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
      return res
        .status(500)
        .json({ error: "Internal server error during validation" });
    }
  };
};
