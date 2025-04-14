import { createContext, useState, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available to any
// child component that calls useAuth().
export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login function to set user email and login status
  const login = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  // Logout function to clear user data
  const logout = () => {
    setUserEmail("");
    setIsLoggedIn(false);
  };

  // Context value that will be provided to consuming components
  const value = {
    userEmail,
    isLoggedIn,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
