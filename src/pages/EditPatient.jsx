import EntityForm from "../components/EntityForm.jsx";
import { getPatientById, updatePatient } from "../services/patientService.js";

export default function EditPatient() {
    return (
        <EntityForm
            title="Edit Patient"
            description="Update patient information"
            fields={[
                { name: "name", label: "Name" },
                { name: "age", label: "Age", type: "number" },
                { name: "gender", label: "Gender" },
                { name: "phone", label: "Phone" },
                { name: "disease", label: "Disease" },
            ]}
            initial={{
                name: "",
                age: "",
                gender: "",
                phone: "",
                disease: "",
            }}
            submitText="Update Patient"
            successTo="/patients"
            load={getPatientById}
            onSubmit={updatePatient}
        />
    );
}