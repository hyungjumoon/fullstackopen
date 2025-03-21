import express from 'express';
import diagnosisService from '../services/diagnosisService';
import { Response } from 'express';
import { Diagnosis } from '../types';

const diagnosesRouter = express.Router();

diagnosesRouter.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosisService.getDiagnoses());
});

diagnosesRouter.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default diagnosesRouter;