import { AppBar, Container, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

// NavText component from your original code
const NavText = ({ href, text, isMain }) => {
  const navigate = useNavigate();
  
  return (
    <Typography
      variant={isMain ? "h6" : "body1"}
      noWrap
      component="div"
      sx={{
        mr: 2,
        cursor: 'pointer',
        fontWeight: isMain ? 700 : 400
      }}
      onClick={() => navigate(href)}
    >
      {text}
    </Typography>
  );
};

// Home button component
const HomeButton = ({ href }) => {
  const navigate = useNavigate();
  
  return (
    <Box
      component="div"
      sx={{
        mr: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
      }}
      onClick={() => navigate(href)}
    >
      <img 
        src="/home-but.png" 
        alt="Home" 
        style={{ 
          height: '28px',
          width: 'auto'
        }} 
      />
    </Box>
  );
};

export default function NavBar() {
  const { isLoggedIn, userEmail, userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Replace login text with home button */}
          <HomeButton href="/" />

          {/* Keep the rest of your navigation structure */}
          <NavText href="/salesperson_page" text="Sales Person Page" />
          <NavText href="/household_page" text="Household Page" />

          <NavText href="/customer_dashboard" text="Customer Page" />
          
          {/* Add the login info and logout button */}
          <Box sx={{ flexGrow: 1 }} />
          
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Welcome, {userName || userEmail}
              </Typography>
              <Button 
                color="inherit" 
                variant="outlined" 
                size="small"
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </Box>
          ) : ( 
            <Button color="inherit" onClick={() => navigate('/')}>
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
