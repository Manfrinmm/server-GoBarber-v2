import { Router } from "express";

import AppointmentController from "../controllers/AppointmentController";

const routes = Router();

// routes.get("/", AppointmentController.index);

routes.post("/", AppointmentController.create);

export default routes;
