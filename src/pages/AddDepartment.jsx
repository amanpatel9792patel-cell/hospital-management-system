import EntityForm from "../components/EntityForm.jsx";
import { addDepartment } from "../services/departmentService.js";

export default function AddDepartment() {
    return (
        <EntityForm
            title="Add Department"
            description="Create a new hospital department"
            fields={[
                { name: "name", label: "Name" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "location", label: "Location" },
            ]}
            initial={{
                name: "",
                description: "",
                location: "",
            }}
            submitText="Save Department"
            successTo="/departments"
            onSubmit={addDepartment}
        />
    );
}