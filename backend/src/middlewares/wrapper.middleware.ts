import type { Request, Response, NextFunction } from "express";

export default (
  asyncFn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFn(req, res, next)).catch(next);
  };
};
