import { Router } from "express";

import ProfileController from "../controllers/ProfileController";

const routes = Router();

routes.get("/", ProfileController.show);

routes.put("/", ProfileController.update);

export default routes;
