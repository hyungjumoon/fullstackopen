import { useParams } from "react-router-dom";
import { Patient } from "../types";

interface Props {
  patients : Patient[]
}

const PatientView = ({ patients } : Props) => {
  const id = useParams().id;
  const patient: Patient | undefined = patients.find(a => a.id === id);
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
        ssh: {patient.ssn} <br />
        occupation: {patient.occupation}
      </div>
    </div>
  );
};

export default PatientView;