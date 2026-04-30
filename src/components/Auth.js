import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,}$/;
  const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  // ================= REGISTER =================
  const handleRegister = async () => {
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Password must be 8 chars with letters & numbers");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      alert("Registered successfully ✔ Now login");

      // 🔥 switch to login UI
      setIsLogin(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      alert("Login successful ✔");

      // save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 go to shop page
      navigate("/shop");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f2f2f2",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "20px",
          borderRadius: "10px",
          background: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <h3 className="text-center mb-3">
          {isLogin ? "Login" : "Register"}
        </h3>

        {/* EMAIL */}
        <input
          type="text"
          placeholder="Email"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        {isLogin ? (
          <button
            className="btn btn-success w-100"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        ) : (
          <button
            className="btn btn-primary w-100"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        )}

        {/* SWITCH */}
        <p className="text-center mt-3">
          {isLogin ? (
            <>
              New user?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;