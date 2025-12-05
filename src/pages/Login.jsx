/*import loginBg from "../images/login_page_background_2.jpg";
import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });

      const data = res.data || {};

      // --- 1. Store token ---
      const token = data.token;
      if (!token) {
        setError("Login failed: missing token in response.");
        return;
      }
      localStorage.setItem("token", token);

      // --- 2. Try to read user info from response body ---
      // If your backend sends a nested user object, handle that too.
      const backendUser = data.user || {};

      // Candidate ids from response or nested user
      const uidFromResponse =
        data.userId ||
        data.id ||
        data.user_id ||
        data.userid ||
        backendUser.userId ||
        backendUser.id ||
        null;

      const roleFromResponse =
        data.role ||
        backendUser.role ||
        null;

      const emailFromResponse =
        data.email ||
        backendUser.email ||
        email;

      // --- 3. Decode token as fallback for id/role/email ---
      let decoded = {};
      try {
        decoded = jwtDecode(token);
      } catch (decodeErr) {
        console.warn("Failed to decode JWT", decodeErr);
      }

      const uid =
        uidFromResponse ||
        decoded.userId ||
        decoded.id ||
        decoded.user_id ||
        decoded.userid ||
        null;

      const role =
        (roleFromResponse || decoded.role || "USER").toUpperCase();

      const finalEmail =
        emailFromResponse ||
        decoded.email ||
        email;

      if (!uid) {
        setError("Login succeeded but user id was not found in response/token.");
        return;
      }

      // --- 4. Normalize user object and store in localStorage ---
      const normalizedUser = {
        id: uid,
        userId: uid,         // mirror so seller dashboard can use either
        role: role,          // ADMIN / SELLER / USER / MERCHANT etc.
        email: finalEmail,
        name: data.name || backendUser.name || decoded.name || "",
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // (Optional) keep separate simple keys if other pages use them
      localStorage.setItem("userId", String(uid));
      localStorage.setItem("role", role);
      localStorage.setItem("email", finalEmail);

      console.log("Logged in user:", normalizedUser);

      // --- 5. Navigate based on role ---
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "SELLER" || role === "MERCHANT") {
        navigate("/seller");
      } else {
        // normal customer / user
        navigate("/UserDashBoard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="LoginSplit">
   
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

      <section className="LoginRight">
        <div
          className="LoginHeroBg"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
      </section>
    </div>
  );
}*/
import loginBg from "../images/login_page_background_2.jpg";
import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data || {};

      // 1) token
      const token = data.token;
      if (!token) {
        setError("Login failed: missing token in response.");
        return;
      }
      localStorage.setItem("token", token);

      // 2) try user info from response
      const backendUser = data.user || {};

      const uidFromResponse =
        data.userId ||
        data.id ||
        data.user_id ||
        data.userid ||
        backendUser.userId ||
        backendUser.id ||
        null;

      const roleFromResponse =
        data.role ||
        backendUser.role ||
        null;

      const emailFromResponse =
        data.email ||
        backendUser.email ||
        email;

      // 3) decode token as fallback
      let decoded = {};
      try {
        decoded = jwtDecode(token);
      } catch (decodeErr) {
        console.warn("Failed to decode JWT", decodeErr);
      }

      const uid =
        uidFromResponse ||
        decoded.userId ||
        decoded.id ||
        decoded.user_id ||
        decoded.userid ||
        null;

      const role =
        (roleFromResponse || decoded.role || "USER").toUpperCase();

      const finalEmail =
        emailFromResponse ||
        decoded.email ||
        email;

      if (!uid) {
        setError("Login succeeded but user id was not found in response/token.");
        return;
      }

      // 4) normalize user and store
      const normalizedUser = {
        id: uid,
        userId: uid,   // same value so dashboards can use either
        role: role,    // ADMIN / SELLER / USER / MERCHANT etc.
        email: finalEmail,
        name: data.name || backendUser.name || decoded.name || "",
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // (optional separate keys)
      localStorage.setItem("userId", String(uid));
      localStorage.setItem("role", role);
      localStorage.setItem("email", finalEmail);

      console.log("Logged in user:", normalizedUser);

      // 5) navigate based on role
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "SELLER" || role === "MERCHANT") {
        navigate("/seller");
      } else {
        navigate("/UserDashBoard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please try again.";
      setError(msg);
    }
  };

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

