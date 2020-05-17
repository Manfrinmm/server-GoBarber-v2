import { Router } from "express";

import { celebrate, Segments, Joi } from "celebrate";

import ProviderDayAvailabilityController from "../controllers/ProviderDayAvailabilityController";
import ProviderMonthAvailabilityController from "../controllers/ProviderMonthAvailabilityController";
import ProvidersController from "../controllers/ProvidersController";

const routes = Router();

routes.get("/", ProvidersController.index);

routes.get(
  "/:provider_id/day-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  ProviderDayAvailabilityController.index,
);
routes.get(
  "/:provider_id/month-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  ProviderMonthAvailabilityController.index,
);

export default routes;
