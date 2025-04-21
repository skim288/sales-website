import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import { green } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import { AuthProvider, useAuth } from './components/AuthContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SalesPage from './pages/SalesPage';
import CustomerPage from './pages/CustomerPage';
import LoginPage from './pages/LoginPage';
import SalespersonPage from './pages/SalespersonPage';
import HouseholdPage from './pages/HouseholdPage'
import TopProductsPage from './pages/TopProductsPage'

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
    return <Navigate to="/" />;
  }
  
  return children;
};

// App component with AuthProvider wrapper
export default function App() {
  useEffect(() => {
    document.title = "Sales Dashboard";
    document.title = "Customer Search";
  }, []);
  
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
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
            path="/top_products_page" 
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
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
