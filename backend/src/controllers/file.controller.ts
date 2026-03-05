import type { NextFunction, Request, Response } from "express";
import wrapper from "../middlewares/wrapper.middleware";
import { CustomError } from "../utils/CustomError";
import { getPool, UPLOAD_DIR } from "../config/db";
import fs from "fs";
import path from "path";

const create = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) return next(new CustomError(400, "Missing uploads"));
      const id = (req as any).user.id;
      const file = await getPool().query(
        `SELECT stored_name FROM files WHERE stored_name = $1 AND size = $2`,
        [req.file.filename, req.file.size],
      );
      if (file.rows.length > 0)
        return next(new CustomError(400, "File already exists"));

      await getPool().query(
        `INSERT INTO files (user_id, original_name, stored_name, mime_type, size) VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          req.file.originalname,
          req.file.filename,
          req.file.mimetype,
          req.file.size,
        ],
      );

      return res.status(201).json({ file: req.file.filename });
    } catch (error) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const find = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rows } = await getPool().query(
        "SELECT id, original_name, mime_type, size, stored_name, created_at FROM files WHERE user_id = $1",
        [(req as any).user.id],
      );
      return res.status(200).json({ files: rows });
    } catch (err) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const findOne = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const fileId = req.params.id;
    try {
      const pool = getPool();
      const { rows } = await pool.query(
        "SELECT stored_name, mime_type, original_name FROM files WHERE id = $1 AND user_id = $2",
        [fileId, (req as any).user.id],
      );
      if (!rows.length) {
        return res.status(404).json({ error: "File not found" });
      }
      const file = rows[0];
      const filePath = path.join(UPLOAD_DIR, file.stored_name);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File missing" });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.original_name}"`,
      );
      res.setHeader("Content-Type", file.mime_type);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } catch (err) {
      next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const remove = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const fileId = req.params.id;
    try {
      const { rows } = await getPool().query(
        "SELECT stored_name FROM files WHERE id = $1 AND user_id = $2",
        [fileId, (req as any).user.id],
      );
      if (!rows.length) {
        return next(new CustomError(404, "File not found"));
      }
      const stored = rows[0].stored_name;
      await getPool().query("DELETE FROM files WHERE id = $1", [fileId]);

      const filePath = path.join(UPLOAD_DIR, stored);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("failed to remove file", err);
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

export { create, find, findOne, remove };
