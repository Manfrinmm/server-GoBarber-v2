import { container } from "tsyringe";

// import IMailProvider from "./MailProvider/implementations";
import IMailProvider from "./MailProvider/models/IMailProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";
import IStorageProvider from "./StorageProvider/models/IStorageProvider";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  DiskStorageProvider,
);

// container.registerSingleton<IStorageProvider>(
//   "IMailProvider",
//   DiskStorageProvider,
// );
