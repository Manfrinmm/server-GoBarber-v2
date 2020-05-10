import { Router } from "express";

import ProvidersController from "../controllers/ProvidersController";

const routes = Router();

routes.get("/", ProvidersController.index);

export default routes;
