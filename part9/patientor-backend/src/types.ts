import { z } from 'zod';
import { newPatientSchema } from './utils';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// export interface Patient {
//   id: string;
//   name: string;
//   dateOfBirth: string;
//   ssn: string;
//   gender: Gender;
//   occupation: string;
// }

// export type NonSensitivePatient = Omit<Patient, 'ssn'>;
 

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[]
}

export type NewPatient = Omit<Patient, 'id'>;

export type NewPatientZ = z.infer<typeof newPatientSchema>;

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;