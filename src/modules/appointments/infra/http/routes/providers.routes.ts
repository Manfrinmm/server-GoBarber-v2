import { Router } from "express";

import ProviderDayAvailabilityController from "../controllers/ProviderDayAvailabilityController";
import ProviderMonthAvailabilityController from "../controllers/ProviderMonthAvailabilityController";
import ProvidersController from "../controllers/ProvidersController";

const routes = Router();

routes.get("/", ProvidersController.index);

routes.get(
  "/:provider_id/day-availability",
  ProviderDayAvailabilityController.index,
);
routes.get(
  "/:provider_id/month-availability",
  ProviderMonthAvailabilityController.index,
);

export default routes;
