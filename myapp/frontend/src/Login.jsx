import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        if (data.user.role === 'manager') {
          navigate('/manager');
        }
        else {
          navigate('/cashier');
        }
      } else {
        alert("Access Denied: Email not found in system.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Failed')} />
    </div>
  );
};

export default Login;
