import data from '../../data/diagnoses';

import { Diagnosis } from '../types';

const getDiagnoses = (): Diagnosis[] => {
  return data;
};

const addDiary = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiary,
};