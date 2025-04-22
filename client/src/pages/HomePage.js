import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { useAuth } from '../components/AuthContext';
import { NavLink } from 'react-router-dom';

export default function HomePage() {
  const { userName, userEmail } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/product_categories`)
      .then(res => res.json())
      .then(resJson => setCategories(resJson));
  }, []);

  // These formatting options leverage flexboxes, an incredibly powerful tool for formatting dynamic layouts.
  // You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const format1 = {};
  const format2 = { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' };
  const format3 = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };
  const format4 = { display: 'grid', justifyContent: 'space-evenly' };
  

  return (
    <Container style={format3}>
      {categories.map((category) =>
        <Box
          key={category.categoryid}
          p={3}
          m={2}
          style={{ background: '#c5cae9', borderRadius: '16px', border: '2px solid #000' }}
        >
          <img
            key={category.categoryid}
            
            alt={`${category.categoryname} album art`}
          />
          <h4><NavLink to={`/top_products_page/${category.categoryid}?categoryname=${category.categoryname}`}>{category.categoryname}</NavLink></h4>
        </Box>
      )}
    </Container>

    
    // <Container maxWidth="md">
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       minHeight: '80vh',
    //     }}
    //   >
    //     <Paper
    //       elevation={3}
    //       sx={{
    //         padding: 5,
    //         borderRadius: 4,
    //         textAlign: 'center',
    //         width: '100%',
    //         maxWidth: 600,
    //         backgroundColor: 'rgba(255, 255, 255, 0.9)',
    //       }}
    //     >
    //       <Typography 
    //         variant="h3" 
    //         component="h1" 
    //         gutterBottom
    //         sx={{ 
    //           fontWeight: 'bold',
    //           color: '#2e7d32' // Matches your green theme
    //         }}
    //       >
    //         Welcome!
    //       </Typography>
          
    //       <Typography 
    //         variant="h5" 
    //         component="h2" 
    //         gutterBottom
    //         sx={{ 
    //           marginTop: 2,
    //           marginBottom: 4,
    //           fontWeight: 500
    //         }}
    //       >
    //         {userName || userEmail}
    //       </Typography>
          
    //       <Typography 
    //         variant="body1" 
    //         sx={{ 
    //           fontSize: '1.1rem',
    //           marginTop: 2
    //         }}
    //       >
    //         Please use the navigation bar at the top to move within the app.
    //       </Typography>
    //     </Paper>
    //   </Box>
    // </Container>
  );
}
