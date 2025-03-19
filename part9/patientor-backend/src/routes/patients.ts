import express from 'express';
import patientService from '../services/patientService';
import { Response } from 'express';
import { NonSensitivePatient } from '../types';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});

patientsRouter.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default patientsRouter;