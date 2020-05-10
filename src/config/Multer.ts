import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

const tmpFolder = resolve(__dirname, "..", "..", "tmp");

export default {
  tmpFolder,
  uploadsFolder: resolve(tmpFolder, "uploads"),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(req, file, cb) {
      const fileHash = crypto.randomBytes(10).toString("HEX");
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
