import EntityForm from "../components/EntityForm.jsx";
import { getDoctorById, updateDoctor } from "../services/doctorService.js";

export default function EditDoctor() {
    return (
        <EntityForm
            title="Edit Doctor"
            description="Update doctor information"
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
            submitText="Update Doctor"
            successTo="/doctors"
            load={getDoctorById}
            onSubmit={updateDoctor}
        />
    );
}