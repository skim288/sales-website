import { createContext, useState, useContext } from "react";
import axios from "axios"; // Make sure to install axios if you haven't already

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available to any
// child component that calls useAuth().
export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Login function to verify email in database and set user data
  const login = async (email, password) => {
    setIsLoading(true);
    setError("");
    // Check if password is correct
      if (password !== "password") {
        setError("Incorrect username or password.");
        setIsLoading(false);
        return { success: false, error: "Incorrect username or password." };
      }
    try {
      // Call the API to check if email exists in the database using your endpoint
      const response = await axios.get(`http://localhost:8080/search_employee_email?email=${encodeURIComponent(email)}`);
      
      if (response.data && response.data.length > 0) {
        const fullName = response.data[0].fullname;
        
      
        
        // Set user data in state
        setUserEmail(email);
        setUserName(fullName);
        setIsLoggedIn(true);
        setError("");
        return { success: true, name: fullName };
      } else {
        // No employee found with this email
        setError("Incorrect username or password.");
        return { success: false, error: "Incorrect username or password." };
      }
    } catch (err) {
      // Handle API errors
      const errorMessage = err.response?.data?.error || "Authentication failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function to clear user data
  const logout = () => {
    setUserEmail("");
    setUserName("");
    setIsLoggedIn(false);
    setError("");
  };

  // Context value that will be provided to consuming components
  const value = {
    userEmail,
    userName,
    isLoggedIn,
    isLoading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}