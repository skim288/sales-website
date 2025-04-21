import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialLogin from "../components/SocialLogin";
import InputField from "../components/InputField";
import { useAuth } from "../components/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    if (!email) {
      setLoginError("Email is required");
      return;
    }
    
    try {
      // Call the login function from AuthContext
      const result = await login(email, password);
      
      if (result.success) {
        // Navigate to the home page after successful login
        navigate("/");
      } else {
        // Display error from failed login
        setLoginError(result.error);
      }
    } catch (err) {
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };
  // NOTE if you want to include the Gmail and Apple login here's the script associated with it (put after Employee Login h2)
  // <h2 className="form-title">Log in with</h2>
  // <SocialLogin />

  // <p className="separator">
  //   <span>or</span>
  // </p>

  // <form 

  return (
    <div className="login-container">
      <h2 className="form-title">Employee Log in</h2>
      <p className="separator">
        <span>You can also put in your Penn Email!</span>
      </p>

      {(loginError || error) && (
        <div className="error-message">
          {loginError || error}
        </div>
      )}

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

        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}