import "reflect-metadata";

import express from "express";

import cors from "cors";
import "express-async-errors";
import { resolve } from "path";

import routes from "./routes";

import "@shared/infra/typeorm"; // Database connection
import "@shared/container";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/files", express.static(resolve(__dirname, "..", "tmp")));
app.use(routes);

app.listen(3333, () => {
  console.log("Server started on port 3333");
});
