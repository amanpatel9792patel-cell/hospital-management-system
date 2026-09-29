import EntityForm from "../components/EntityForm.jsx";
import {
    getDepartmentById,
    updateDepartment,
} from "../services/departmentService.js";

export default function EditDepartment() {
    return (
        <EntityForm
            title="Edit Department"
            description="Update department information"
            fields={[
                { name: "name", label: "Name" },
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                },
                { name: "location", label: "Location" },
            ]}
            initial={{
                name: "",
                description: "",
                location: "",
            }}
            submitText="Update Department"
            successTo="/departments"
            load={getDepartmentById}
            onSubmit={updateDepartment}
        />
    );
}