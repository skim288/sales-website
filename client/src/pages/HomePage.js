import React from 'react';
import { Box, Container } from '@mui/material';
import { useAuth } from '../components/AuthContext';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
const config = require('../config.json');

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
          style={{
            background: '#c5cae9',
            borderRadius: '16px',
            border: '2px solid #000',
            width: '250px',
            textAlign: 'center'
          }}
        >
          <img
            src={category.category_img_link}
            // src={"https://images.pexels.com/photos/1005406/pexels-photo-1005406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
            
            key={category.categoryid}
            alt={`${category.categoryname}`}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '10px'
            }}
          />

          <h4><NavLink to={`/top_products_page/${category.categoryid}?categoryname=${category.categoryname}`}>{category.categoryname}</NavLink></h4>
        </Box>
      )}
    </Container>

    
  );
}
