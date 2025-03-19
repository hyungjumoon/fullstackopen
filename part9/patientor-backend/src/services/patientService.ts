import data from '../../data/patients';

import { NonSensitivePatient } from '../types';

// const getEntries = (): DiaryEntry[] => {
//   return diaries;
// };

const getPatients = (): NonSensitivePatient[] => {
  return data.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addDiary = () => {
  return null;
};

export default {
  // getEntries,
  addDiary,
  getPatients
};