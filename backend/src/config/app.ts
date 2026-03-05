import express from "express";
import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { CustomError } from "../utils/CustomError.ts";
import routes from "../routes/index.ts";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(err.statusCode).json({ error: { message: err.message } });
  next();
});

export default app;
