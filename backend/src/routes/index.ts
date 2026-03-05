import { Router } from "express";
import authRouter from "./auth.route.ts";
import fileRouter from "./file.route.ts";
import { authGaurd } from "../middlewares/gaurd.middleware.ts";

const router = Router();

router.use("/auth", authRouter);

router.use("/files", authGaurd, fileRouter);
export default router;
