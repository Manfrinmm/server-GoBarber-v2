import "reflect-metadata";
import "dotenv/config";

import express from "express";

import cors from "cors";
import "express-async-errors";

import routes from "./routes";

import "@shared/infra/typeorm"; // Database connection
import "@shared/container";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(3333, () => {
  console.log("Server started on port 3333");
});
