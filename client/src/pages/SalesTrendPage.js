
import { useEffect, useState } from 'react';
import {
  Container,
  Checkbox,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const config = require('../config.json');

export default function SalesChartPage() {
  const [category, setCategory] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [title, setTitle] = useState('');

  // Fetch all sales data on mount
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/monthly_sales_by_category`)
      .then(res => res.json())
      .then(resJson => setSalesData(resJson));
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/monthly_sales_by_category?category=${category}`)
      .then(res => res.json())
      .then(resJson => setSalesData(resJson));
  };

  const categories = [
    'Confections', 'Shell Fish', 'Cereals', 'Dairy', 'Beverages',
    'Seafood', 'Meat', 'Grain', 'Poultry', 'Snails', 'Produce'
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Monthly Sales by Category</Typography>

      <Grid container spacing={4} alignItems="center">

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Select Product Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Product Category"
              onChange={e => setCategory(e.target.value)}
              renderValue={selected => selected || '— None —'}
            >
              <MenuItem value="">
                <Checkbox checked={category === ''} sx={{ p: 0, mr: 1 }} />
                <ListItemText primary="— None —" />
              </MenuItem>
              {categories.map(item => (
                <MenuItem key={item} value={item}>
                  <Checkbox checked={category === item} sx={{ p: 0, mr: 1 }} />
                  <ListItemText primary={item} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button variant="contained" fullWidth onClick={search}>Search</Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {title || 'Sales Overview'}
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={salesData}
              margin={{ top: 80, right: 30, left: 50, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sales_month" />
              <YAxis />
              <Tooltip />
                <Bar
                dataKey="sales"
                fill="#1976d2"
                label={({ x, y, value }) => (
                    <text x={x + 10} y={y - 5} fill="#000" fontSize={12}>{value}</text>
                )}
                />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

