import fs from "fs";
import path from "path";

import IStorageProvider from "../models/IStorageProvider";

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    const pathToTmpFolder = path.resolve(
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "tmp",
    );

    await fs.promises.rename(
      path.resolve(pathToTmpFolder, file),
      path.resolve(pathToTmpFolder, "uploads", file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const pathToTmpFolder = path.resolve(
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "tmp",
    );
    const filePath = path.resolve(
      path.resolve(pathToTmpFolder, "uploads", file),
    );

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
