import { Router } from "express";
import authRouter from "./auth.route";
import fileRouter from "./file.route";
import { authGaurd } from "../middlewares/gaurd.middleware";

const router = Router();

router.use("/auth", authRouter);

router.use("/files", authGaurd, fileRouter);
export default router;
