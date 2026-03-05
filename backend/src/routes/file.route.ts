import { Router } from "express";
import {
  create,
  find,
  findOne,
  remove,
} from "../controllers/file.controller.ts";

import multer from "multer";
import { CustomError } from "../utils/CustomError.ts";
import { hashName } from "../utils/fileHelper.ts";
import { UPLOAD_DIR } from "../config/db.ts";
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    callback(null, hashName(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "application/pdf",
      "text/plain",
      "application/octet-stream",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new CustomError(400, "File type not allowed"));
    }
  },
});

const fileRouter = Router();

fileRouter.post("/upload", upload.single("file"), create);
fileRouter.get("/all", find);

fileRouter.route("/:id").get(findOne).delete(remove);

export default fileRouter;
