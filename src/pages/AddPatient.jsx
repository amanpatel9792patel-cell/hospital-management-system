import EntityForm from "../components/EntityForm.jsx";
import { addPatient } from "../services/patientService.js";

export default function AddPatient() {
    return (
        <EntityForm
            title="Add Patient"
            description="Create a new patient"
            fields={[
                {
                    name: "name",
                    label: "Name",
                },
                {
                    name: "age",
                    label: "Age",
                    type: "number",
                },
                {
                    name: "gender",
                    label: "Gender",
                },
                {
                    name: "phone",
                    label: "Phone",
                },
                {
                    name: "disease",
                    label: "Disease",
                },
            ]}
            initial={{
                name: "",
                age: "",
                gender: "",
                phone: "",
                disease: "",
            }}
            submitText="Save Patient"
            successTo="/patients"
            onSubmit={addPatient}
        />
    );
}