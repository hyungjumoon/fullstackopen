import express from 'express';
import diaryService from '../services/diaryService';
import { Response } from 'express';
import { NonSensitiveDiaryEntry } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;