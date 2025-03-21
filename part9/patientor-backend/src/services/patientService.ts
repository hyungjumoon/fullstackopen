import data from '../../data/patients';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatient, Patient , NewPatient } from '../types';

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

const addPatient = ( patient : NewPatient ): Patient => {
  const newPatient = {
    id : uuid(),
    ...patient
  };

  data.push(newPatient);
  return newPatient;
};

export default {
  // getEntries,
  addPatient,
  getPatients
};