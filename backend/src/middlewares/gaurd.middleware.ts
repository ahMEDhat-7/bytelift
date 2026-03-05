import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError.ts";
import { verifyToken } from "../utils/tokenHelper.ts";
import { getPool } from "../config/db.ts";

const authGaurd = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check token exists
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next(new CustomError(400, "token not provided"));
    // extract payload
    const payload = verifyToken(token);
    // verify if valid
    if (!payload)
      return next(
        new CustomError(401, "Invalid Token - Token is invalid or expired"),
      );

    const user = await getPool().query(
      "SELECT id , email FROM users WHERE id = $1",
      [payload.id],
    );

    // pass or prevent
    (req as any)["user"] = payload;
    next();
  } catch (error) {
    next(new CustomError(500, "Something wrong occurs"));
  }
};

export { authGaurd };
