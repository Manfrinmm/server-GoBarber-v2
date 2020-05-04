import { Router } from "express";
import { getCustomRepository } from "typeorm";

import { parseISO } from "date-fns";

import AppointmentsRepository from "../app/repositories/AppointmentsRepository";
import CreateAppointmentService from "../app/services/CreateAppointmentService";

const routes = Router();

routes.get("/", async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();

  res.status(200).json(appointments);
});

routes.post("/", async (req, res) => {
  const { date, user_id, provider_id } = req.body;

  const parsedData = parseISO(date);

  const data = {
    date: parsedData,
    user_id,
    provider_id,
  };

  const createAppointmentService = new CreateAppointmentService();

  try {
    const appointment = await createAppointmentService.execute(data);

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default routes;
