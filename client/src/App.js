import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import { green } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import { AuthProvider, useAuth } from './components/AuthContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import SongsPage from './pages/SongsPage';
import AlbumInfoPage from './pages/AlbumInfoPage';
import SalesPage from './pages/SalesPage';
import CustomerPage from './pages/CustomerPage';
import LoginPage from './pages/LoginPage';

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
              path="/sales_dashboard" 
              element={
                <ProtectedRoute>
                  <SalesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/albums/:album_id" 
              element={
                <ProtectedRoute>
                  <AlbumInfoPage />
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