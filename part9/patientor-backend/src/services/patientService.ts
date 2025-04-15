import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatient, Patient , NewPatient } from '../types';

// const getEntries = (): DiaryEntry[] => {
//   return diaries;
// };

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};


const getPatient = (id : string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addPatient = ( patient : NewPatient ): Patient => {
  const newPatient : Patient = {
    id : uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  // getEntries,
  addPatient,
  getPatients,
  getPatient
};