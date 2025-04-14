import { useState } from "react";
import SocialLogin from "../components/SocialLogin";
import InputField from "../components/InputField";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you'd validate credentials here
    // For this example, we'll just log in with the email
    login(email);
    
    // Navigate to the dashboard after login
    navigate("/sales_dashboard");
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Log in with</h2>
      <SocialLogin />

      <p className="separator">
        <span>or</span>
      </p>

      <form onSubmit={handleSubmit} className="login-form">
        <InputField 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <InputField 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
}



/*
export default function LoginPage() {
  return (
    <div className="login-container">
      <h2 className="form-title">Log in with</h2>
      <SocialLogin />

      <p className="separator">
        <span>or</span>
      </p>

      <form action="#" className="login-form">
        <InputField type="email" placeholder="Email address" />
        <InputField type="password" placeholder="Password" />


        <button type="submit" className="login-button">
          Log In
        </button>
      </form>

    </div>
  );
}
     // Removed from the login box
        <a href="#" className="forgot-password-link">
          Forgot password?
        </a>
      <p className="signup-prompt">
        Don&apos;t have an account?{" "}
        <a href="#" className="signup-link">
          Sign up
        </a>
      </p>

*/