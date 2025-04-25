import { useEffect, useState } from "react";
import patientService from "../services/patients";
import { useParams } from "react-router-dom";
import { Patient } from "../types";

const PatientView = () => {
  const [patient, setPatient] = useState<Patient>();
  let id = useParams().id;
  if (id === undefined) {
    id = "";
  }

  useEffect(() => {
    const fetchPatient = async () => {
      const tmp = await patientService.getOne(id);
      setPatient(tmp);
    };
    void fetchPatient();
  }, [id]);

  // const patient: Patient | undefined = patients.find(a => a.id === id);
  if (patient === undefined) {
    return (
      <div>
        Error, patient not found
      </div>
    );
  }
  return (
    <div>
      <h2>{patient.name} </h2>
      <div>
        gender: {patient.gender} <br />
        ssh: {patient.ssn} <br />
        occupation: {patient.occupation}
      </div>
    </div>
  );
};

export default PatientView;