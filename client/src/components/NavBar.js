import { AppBar, Container, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from '../components/AuthContext';
import { useNavigate } from "react-router-dom";

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

export default function NavBar() {
  const { isLoggedIn, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Keep your original navigation structure */}
          <NavText href="/" text="Sales Dashboard" isMain />
          <NavText href="/sales_dashboard" text="Sales Dashboard" />
          <NavText href="/customer_dashboard" text="Customer Dashboard" />
          
          {/* Add the login info and logout button */}
          <Box sx={{ flexGrow: 1 }} />
          
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Logged in as: {userEmail}
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
/*
// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? "h5" : "h7"}
      noWrap
      style={{
        marginRight: "30px",
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".3rem",
      }}
    >
      <NavLink
        to={href}
        style={{
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavText href="/" text="Sales Dashboard" isMain />
          <NavText href="/sales_dashboard" text="Sales Dashboard" />
          <NavText href="/customer_dashboard" text="Customer Dashboard" />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
*/
