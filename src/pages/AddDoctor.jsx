import EntityForm from "../components/EntityForm.jsx";
import { addDoctor } from "../services/doctorService.js";

export default function AddDoctor() {
    return (
        <EntityForm
            title="Add Doctor"
            description="Create a new doctor"
            fields={[
                { name: "name", label: "Name" },
                { name: "specialization", label: "Specialization" },
                { name: "phone", label: "Phone" },
                { name: "department", label: "Department" },
                { name: "experience", label: "Experience", type: "number" },
                { name: "email", label: "Email", type: "email" },
            ]}
            initial={{
                name: "",
                specialization: "",
                phone: "",
                department: "",
                experience: "",
                email: "",
            }}
            submitText="Save Doctor"
            successTo="/doctors"
            onSubmit={addDoctor}
        />
    );
}