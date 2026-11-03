import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
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

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account. Please try again.");
      }

      setSuccessMessage("Account created successfully! Launching trading dashboard...");
      localStorage.setItem("tradex_token", data.token);
      localStorage.setItem("tradex_user", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.href = `http://localhost:3001?name=${encodeURIComponent(
          data.user.name
        )}&token=${encodeURIComponent(data.token)}`;
      }, 900);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-4">
      <div className="row align-items-center justify-content-center">
        {/* Left Side: Marketing info */}
        <div className="col-12 col-lg-6 mb-5 mb-lg-0 text-center text-lg-start pe-lg-5">
          <img
            src="/media/images/signup.png"
            alt="Open account"
            className="img-fluid mb-4"
            style={{ maxHeight: "300px" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 className="fw-bold mb-3">Open a TradeX account</h1>
          <p className="text-muted fs-5">
            Modern trading platform, ₹0 brokerage on equity investments, and flat ₹20 intraday and F&O trades.
          </p>
          <ul className="list-unstyled text-muted mt-3">
            <li className="mb-2">✓ Real-time portfolio performance & financial analytics</li>
            <li className="mb-2">✓ Dynamic live stock market quotes</li>
            <li className="mb-2">✓ Interactive Chart.js charts and visualizations</li>
          </ul>
        </div>

        {/* Right Side: Signup Form */}
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <h3 className="fw-bold mb-1">Create free account</h3>
            <p className="text-muted mb-4">Start trading and tracking your portfolio in minutes</p>

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
                <label className="form-label text-muted fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Gourav Batra"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
                  minLength={6}
                  placeholder="At least 6 characters"
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
                {loading ? "Creating Account..." : "Continue to Trading Dashboard"}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-muted">Already registered? </span>
              <Link to="/login" className="text-decoration-none fw-semibold">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
