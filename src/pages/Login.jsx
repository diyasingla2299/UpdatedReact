// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import loginBg from "../images/login_page_background_2.jpg";
import "./Login.css";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // -------- Login Submit Handler --------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;

      // Store token
      localStorage.setItem("token", token);

      // 1️⃣ Try taking userId / role / email directly from response
      if (res.data.userId) {
        localStorage.setItem("userId", String(res.data.userId)); // ✅
      }
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      }
      if (res.data.email) {
        localStorage.setItem("email", res.data.email);
      }

      // 2️⃣ Decode JWT as backup
      const decoded = jwtDecode(token);

      const existingUid = localStorage.getItem("userId");
      if (!existingUid) {
        const uid =
          decoded.userId ??
          decoded.id ??
          decoded.user_id ??
          decoded.userid ??
          decoded.userIdFk ??
          null;

        if (uid != null) {
          localStorage.setItem("userId", String(uid));
        }
      }

      if (!localStorage.getItem("role") && decoded.role) {
        localStorage.setItem("role", decoded.role);
      }
      if (!localStorage.getItem("email") && decoded.email) {
        localStorage.setItem("email", decoded.email);
      }

      // Redirect to dashboard
      navigate("/UserDashBoard");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please try again.";
      setError(msg);
    }
  };

  // -------- Auto-clear error after 3 seconds --------
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="LoginSplit">
      {/* LEFT FORM */}
      <section className="LoginLeft">
        <div className="LoginCard">
          <h1 className="h1_label">
            <i>Welcome to ShopSphere</i>
          </h1>
          <h4 className="h1_label">
            <i>Start Your Adventure Today</i>
          </h4>

          <form onSubmit={handleLogin} className="LoginForm">
            <div className="FormRow">
              <label>Email</label>
              <input
                className="input1"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="FormRow">
              <label>Password</label>
              <input
                className="input1"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="submit1" type="submit">
              Login
            </button>
          </form>

          <h6 className="h1_label">
            <i>
              Not a user yet?{" "}
              <Link to="/SignUpPage" className="SignUpLink">
                Sign Up
              </Link>
            </i>
          </h6>

          {error && <div className="Toast Toast--error">{error}</div>}
        </div>
      </section>

      {/* RIGHT IMAGE */}
      <section className="LoginRight">
        <div
          className="LoginHeroBg"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
      </section>
    </div>
  );
}
