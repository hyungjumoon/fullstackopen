import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { NonSensitivePatient, NewPatientZ, Patient } from '../types';
import { newPatientSchema } from '../utils';
import { z } from 'zod';

const patientsRouter = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

patientsRouter.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});


patientsRouter.get('/:id', (req: Request<{ id: string }>, res: Response<Patient>) => {
  const patient : Patient | undefined = patientService.getPatient(req.params.id);
  if (patient === undefined) {
    res.status(404).send();
  } else {
    res.send(patient);
  }
});

patientsRouter.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientZ>, res: Response<Patient>) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

patientsRouter.use(errorMiddleware);

// patientsRouter.post('/', (req, res) => {
//   try {
//     // const newPatient = toNewPatient(req.body);
//     const newPatient = newPatientSchema.parse(req.body);
//     const addedPatient = patientService.addPatient(newPatient);
//     res.json(addedPatient);
//   } catch (error: unknown) {
//     if (error instanceof z.ZodError) {
//       res.status(400).send({ error: error.issues });
//     } else {
//       res.status(400).send({ error: 'unknown error' });
//     }
//   }
// });

export default patientsRouter;