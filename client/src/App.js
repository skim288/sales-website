import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import { green } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import { AuthProvider, useAuth } from './components/AuthContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import LoginPage from './pages/LoginPage';
import SalespersonPage from './pages/SalespersonPage';
import HouseholdPage from './pages/HouseholdPage';
import TopProductsPage from './pages/TopProductsPage';
import SalesTrendPage from './pages/SalesTrendPage';

// Create theme
export const theme = createTheme({
  palette: {
    primary: green,
    secondary: green,
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/auth" />;
  }
  return children;
};

// Login route component - redirects to home if already logged in
const LoginRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  if (isLoggedIn) {
    // Redirect to home if already logged in
    return <Navigate to="/" />;
  }
  
  return children;
};

// NavBar wrapper that only displays on non-login pages
const ConditionalNavBar = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  
  // Don't show navbar on auth page (path "/auth") or if not logged in
  if (location.pathname === "/auth" || !isLoggedIn) {
    return null;
  }
  
  return <NavBar />;
};

// App component with AuthProvider wrapper
export default function App() {
  useEffect(() => {
    document.title = "Sales Dashboard";
  }, []);
  
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {/* NavBar is now conditionally rendered inside the Router */}
          <ConditionalNavBar />
          <Routes>
            {/* Login page - redirects to home if already logged in */}
            <Route 
              path="/auth" 
              element={
                <LoginRoute>
                  <LoginPage />
                </LoginRoute>
              } 
            />
            
            {/* Home page - protected, only accessible when logged in */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Sales dashboard page */}
            <Route 
              path="/salesperson_page" 
              element={
                <ProtectedRoute>
                  <SalespersonPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/household_page" 
              element={
                <ProtectedRoute>
                  <HouseholdPage />
                </ProtectedRoute>
              } 
            />


           <Route 
            path="/top_products_page/:categoryid" 
            element={
              <ProtectedRoute>
                <TopProductsPage />
              </ProtectedRoute>
            } 
          />

            
            <Route 
              path="/customer_dashboard" 
              element={
                <ProtectedRoute>
                  <CustomerPage />
                </ProtectedRoute>
              } 
            />
    

          <Route 
              path="/sales_trend_dashboard" 
              element={
                <ProtectedRoute>
                  <SalesTrendPage />
                </ProtectedRoute>
              } 
            />
          </Routes>

        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
