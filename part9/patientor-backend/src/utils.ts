import { NewPatient } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const toNewPatient = (object: unknown): NewPatient => {
  const { name, dateOfBirth, ssn, gender, occupation } = object.body;
  const newPatient: NewPatient = {
    // ...
  };

  return newPatient;
};

export default toNewPatient;