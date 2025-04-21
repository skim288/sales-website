import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { useAuth } from '../components/AuthContext';

export default function HomePage() {
  const { userName, userEmail } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 5,
            borderRadius: 4,
            textAlign: 'center',
            width: '100%',
            maxWidth: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#2e7d32' // Matches your green theme
            }}
          >
            Welcome!
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              marginTop: 2,
              marginBottom: 4,
              fontWeight: 500
            }}
          >
            {userName || userEmail}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              marginTop: 2
            }}
          >
            Please use the navigation bar at the top to move within the app.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}