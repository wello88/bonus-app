import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../components/contexts/AuthContext';
import { verifyToken } from '../utils/auth'; // Create a utility to decode tokens

import '../styles/Login.scss';
const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/token/", credentials);
      const token = response.data.access;
      localStorage.setItem("token", token);
      setToken(token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const tokenPayload = verifyToken(token);

      if (tokenPayload) {
        setUser(tokenPayload); // Assuming payload contains user details

        if (tokenPayload.role === "FINANCE") {
          navigate("/dashboard");
        } else if (tokenPayload.role === "MANAGER") {
          navigate("/dashboard");
        } else {
          throw new Error("Invalid role");
        }
      } else {
        throw new Error("Token verification failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;