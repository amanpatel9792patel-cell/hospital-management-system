import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import AddPatient from "./pages/AddPatient.jsx";
import EditPatient from "./pages/EditPatient.jsx";
import DoctorsList from "./pages/DoctorsList.jsx";
import AddDoctor from "./pages/AddDoctor.jsx";
import EditDoctor from "./pages/EditDoctor.jsx";
import Departments from "./pages/Departments.jsx";
import AddDepartment from "./pages/AddDepartment.jsx";
import EditDepartment from "./pages/EditDepartment.jsx";
import Appointments from "./pages/Appointments.jsx";
import AddAppointment from "./pages/AddAppointment.jsx";
import EditAppointment from "./pages/EditAppointment.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/add" element={<AddPatient />} />
          <Route path="patients/edit/:id" element={<EditPatient />} />
          <Route path="doctors" element={<DoctorsList />} />
          <Route path="doctors/add" element={<AddDoctor />} />
          <Route path="doctors/edit/:id" element={<EditDoctor />} />
          <Route path="departments" element={<Departments />} />
          <Route path="departments/add" element={<AddDepartment />} />
          <Route path="departments/edit/:id" element={<EditDepartment />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/add" element={<AddAppointment />} />
          <Route path="appointments/edit/:id" element={<EditAppointment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
