import React from "react";
import axios from "axios"; 
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import password_icon from "../Assets/password.png";
import email_icon from "../Assets/email.png";
import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
const LoginSignup = () => {
  const [action, setAction] = useState("Signup");
const navigate= useNavigate();

// Form state
const [username, setUsername] = useState("");
const [email, setEmail]       = useState("");
const [password, setPassword] = useState("");




  // Handle submit
  const handleSubmit = async () => {
    try {
      if (action === "Sign Up") {
        // Call register endpoint
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          username,
          email,
          password
        });
        if (res.status === 201) {
          alert("User registered successfully! Now you can log in.");
          // Switch to "Login" mode
          setAction("Login");
        }
      } else {
        // Call login endpoint
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password
        });
        if (res.status === 200) {
          const { token, message } = res.data;
          alert(message);
          // Store token
          localStorage.setItem("token", token);
          // Navigate to Home
          navigate("/home");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <div className="outer-container">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        {/* Toggle Buttons */}
        <div className="submit-container">
          <div
            className={action === "Sign Up" ? "submit" : "submit gray"}
            onClick={() => {
              setAction("Sign Up");
              setUsername("");
              setEmail("");
              setPassword("");
            }}
          >
            Sign Up
          </div>
          <div
            className={action === "Login" ? "submit" : "submit gray"}
            onClick={() => {
              setAction("Login");
              setUsername("");
              setEmail("");
              setPassword("");
            }}
          >
            Login
          </div>
        </div>

        {/* Form Inputs */}
        <div className="inputs">
          {/* Username only shows if we're in "Sign Up" mode */}
          {action === "Sign Up" && (
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Forgot password + Possibly more links */}
        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>

        {/* Submit button */}
        <div className="btn-container">
          <button className="auth-button" onClick={handleSubmit}>
            {action === "Sign Up" ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
