import { useContext, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { user, login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(
        username.trim(),
        password
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate(
        location.state?.from || "/",
        { replace: true }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          🏥
        </div>

        <h1>
          Hospital Management
        </h1>

        <p className="muted">
          Administrator Login
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          onSubmit={submit}
          className="form-stack"
        >

          <label>
            Username

            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              autoComplete="username"
              disabled={loading}
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
            />
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}