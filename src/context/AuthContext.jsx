import { createContext, useState } from "react";
import api from "../services/api.js";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  const login = async (username, password) => {
    if (!username?.trim() || !password) {
      return {
        success: false,
        message: "Username and password are required.",
      };
    }

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });

     const { token, username: loggedInUsername, role } = response.data;

const loggedInUser = {
    username: loggedInUsername,
    role
};

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      setUser(loggedInUser);

      return {
        success: true,
        user: loggedInUser,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Invalid username or password.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}