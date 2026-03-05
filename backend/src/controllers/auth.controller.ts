import type { Request, Response, NextFunction } from "express";
import wrapper from "../middlewares/wrapper.middleware.ts";
import { CustomError } from "../utils/CustomError.ts";
import { hashPassword, verifyPassword } from "../utils/hashHelper.ts";
import { getPool } from "../config/db.ts";
import { generateToken } from "../utils/tokenHelper.ts";

const signup = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email && !password)
        return next(new CustomError(400, "Missing credintials"));

      const hashedPassword = await hashPassword(password);
      const user = await getPool().query(
        "INSERT INTO users(email,password_hash) VALUES($1,$2);",
        [email, hashedPassword],
      );
      const token = generateToken({ id: user.rows[0].id });

      return res.status(201).json({
        message: "user created",
        data: { id: user.rows[0].id, email: user.rows[0].email, token },
      });
    } catch (error) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const login = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email && !password)
        return next(new CustomError(400, "Missing credintials"));

      const user = await getPool().query(
        "SELECT id ,email, password_hash FROM users WHERE email= $1;",
        [email],
      );
      if (!user.rows)
        return next(new CustomError(401, "Invalid email or password"));
      const check = await verifyPassword(password, user.rows[0].password_hash);
      if (!check) return next(new CustomError(401, "Invalid password"));

      const token = generateToken({ id: user.rows[0].id });

      return res.status(200).json({
        message: "you logged in",
        data: { id: user.rows[0].id, email: user.rows[0].email, token },
      });
    } catch (error) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

export { login, signup };
