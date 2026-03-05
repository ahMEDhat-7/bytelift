import type { Request, Response, NextFunction } from "express";

export default (
  asyncFn: (req: Request, res: Response, next: NextFunction) => void,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      asyncFn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
