import { Router } from "express";

import AuthenticateSessionService from "../app/services/AuthenticateSessionService";

const sessionRouter = Router();

sessionRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  const createSession = new AuthenticateSessionService();

  const { user, token } = await createSession.execute({ email, password });

  res.status(201).json({ user, token });
});

export default sessionRouter;
