import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempted with:", username, password);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        
        if (data.isManager) {
          navigate('/manager');
        } 
        else {
          navigate('/cashier');
        }
      } 
      else {
        alert("login failed! check username & password");
        console.error('Login failed:', data.error);
      }
    } 
    catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Employee Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
            required
          />
          <button type="submit" aria-label="Login">Login</button>
        </form>

        <button className="back-button" onClick={() => navigate("/")} aria-label="Back to Dashboard">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Login;
