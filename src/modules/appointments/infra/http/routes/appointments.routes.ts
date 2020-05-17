import { Router } from "express";

import { celebrate, Segments, Joi } from "celebrate";

import AppointmentController from "../controllers/AppointmentController";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";

const routes = Router();

// routes.get("/", AppointmentController.index);

routes.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  AppointmentController.create,
);

routes.get("/schedule", ProviderAppointmentsController.index);
export default routes;
