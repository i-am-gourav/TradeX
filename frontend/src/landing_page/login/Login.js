import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      setSuccessMessage("Login successful! Redirecting to trading dashboard...");
      localStorage.setItem("tradex_token", data.token);
      localStorage.setItem("tradex_user", JSON.stringify(data.user));

      // Redirect to dashboard with query parameters
      setTimeout(() => {
        window.location.href = `http://localhost:3001?name=${encodeURIComponent(
          data.user.name
        )}&token=${encodeURIComponent(data.token)}`;
      }, 800);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo helper for instant testing
  const handleDemoLogin = () => {
    const demoUser = {
      name: "Demo Trader",
      email: "demo@tradex.com",
      accountBalance: 100000,
    };
    localStorage.setItem("tradex_user", JSON.stringify(demoUser));
    window.location.href = `http://localhost:3001?name=Demo%20Trader`;
  };

  return (
    <div className="container py-5 my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-1">Welcome back to TradeX</h2>
              <p className="text-muted">Login to access your trading portfolio and orders</p>
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2" role="alert">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success py-2" role="alert">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Email address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-semibold"
                style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn btn-outline-secondary btn-sm w-100 py-2"
              >
                ⚡ Instant Demo Login (Skip credentials)
              </button>
            </div>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/signup" className="text-decoration-none fw-semibold">
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

