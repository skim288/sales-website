import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect } from 'react';
import { green, darkgreen } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import SongsPage from './pages/SongsPage';
import AlbumInfoPage from './pages/AlbumInfoPage'
import SalesPage from './pages/SalesPage'
import CustomerPage from './pages/CustomerPage'
import LoginPage from './pages/LoginPage'

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: green,
    secondary: green,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  useEffect(() => {
    document.title = "Sales Dashboard"; // Change this to your desired app title
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/sales_dashboard" element={<SalesPage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/customer_dashboard" element={<CustomerPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}