import { NavLink } from "react-router-dom";

const links = [
  ["/", "📊", "Dashboard"],
  ["/patients", "👥", "Patients"],
  ["/doctors", "👨‍⚕️", "Doctors"],
  ["/appointments", "📅", "Appointments"],
  ["/departments", "🏢", "Departments"],
];

export default function Sidebar({ open, onClose }) {
  return <>
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-title">🏥 <span>Hospital</span></div>
      <nav className="sidebar-menu">
        {links.map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
            <span>{icon}</span><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
    {open && <div className="sidebar-overlay" onClick={onClose} />}
  </>;
}
