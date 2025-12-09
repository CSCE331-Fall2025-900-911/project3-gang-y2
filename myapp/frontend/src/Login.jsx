import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import "./Login.css";
import { useTranslation } from "./i18n/TranslationContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { translate } = useTranslation();

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
        alert(translate("login.denied"));
      }
    } catch (err) {
      console.error(err);
      alert(translate("login.failed"));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{translate("login.title")}</h1>
        <br></br>
        <GoogleLogin onSuccess={handleSuccess} onError={() => {}} />
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/')}
          >
            {"Back"}
          </button>
      </div>
    </div>
  );
};
export default Login;
