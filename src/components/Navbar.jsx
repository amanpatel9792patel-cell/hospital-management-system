import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-button" onClick={onMenuClick} aria-label="Open menu">☰</button>
        <div className="brand-mark">🏥</div>
        <div><strong>Hospital Management System</strong><small>Admin Portal</small></div>
      </div>
      {user && <div className="navbar-right">
        <div className="user-info"><strong>{user.username}</strong><span>{user.role}</span></div>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>}
    </header>
  );
}
