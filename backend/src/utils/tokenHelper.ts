import jwt from "jsonwebtoken";

import type { PayloadToken } from "../common/types/auth";

const generateToken = (payload: PayloadToken): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
  return token;
};

const verifyToken = (token: string) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as PayloadToken;

  return payload;
};

export { generateToken, verifyToken };
