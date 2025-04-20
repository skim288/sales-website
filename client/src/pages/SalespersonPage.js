import { useEffect, useState } from 'react';

import {
    Container,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography
  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField     from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';


import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');


export default function SongsPage() {
    const [salesperson, setSalesperson] = useState([]);
    const [zip, setZip] = useState('');
    const [category, setCategory] = useState('');
    

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/top_salesperson`)
          .then(res => res.json())
          .then(resJson => setSalesperson(resJson));
      }, []);
    const search = () => {
        // let url = `http://${config.server_host}:${config.server_port}/top_salesperson?zip=${zip}`;
        // if (category) {
        //     url += `&category=${encodeURIComponent(category)}`;
        // }
        fetch(`http://${config.server_host}:${config.server_port}/top_salesperson?zip=${zip}` +
            `&category=${category}`
        )
          .then(res => res.json())
          .then(resJson => setSalesperson(resJson));
    };

    const categoryOptions = [
        'All Categories',
        'Electronics',
        'Furniture',
        'Clothing',
        'Books',

      ];

    
      
    return (
        <Container>
          <h2>Search</h2>
          <Grid container spacing={6}>
            <Grid item xs={8}>
              <TextField label='ZIP code' value={zip} onChange={(e) => setZip(e.target.value)} style={{ width: "100%" }}/>
            </Grid>
          </Grid>


          
        <Grid item xs={12} md={4}>
        <FormControl fullWidth>
            <InputLabel id="category-label">Product Category</InputLabel>
            <Select
            labelId="category-label"
            value={category}
            label="Product Category"
            onChange={e => setCategory(e.target.value)}
            >
            {/* “None” choice */}
            <MenuItem value="">
                <Checkbox checked={category === ''} sx={{ p: 0, mr: 1 }} />
                <ListItemText primary="— None —" />
            </MenuItem>
            {['Confections', 'Shell Fish', 'Cereals', 'Dairy', 'Beverages', 'Seafood',
                'Meat', 'Grain', 'Poultry', 'Snails', 'Produce'].map(item => (
                <MenuItem key={item} value={item}>
                <Checkbox checked={category === item} sx={{ p: 0, mr: 1 }} />
                <ListItemText primary={item} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        </Grid>

          {/* <Grid item xs={12} md={4}>
            <Autocomplete
                freeSolo
                options={categoryOptions}
                value={category}
                onInputChange={(e, newValue) => setCategory(newValue)}
                renderInput={params => (
                <TextField
                    {...params}
                    label="Category"
                    placeholder="Type or select a category"
                    fullWidth
                />
                )}
            />
            </Grid> */}
            
            <Grid item xs={12} md={4}>

          <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
            Search
          </Button>
          </Grid>
         
          <h2>Results</h2>
          
    <Typography variant="h4" gutterBottom>
        Top Salesperson
    </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell align="right">Total Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesperson.map(person => (
              <TableRow key={person.employeeid}>
                <TableCell>{person.employeeid}</TableCell>
                <TableCell>{person.firstname}</TableCell>
                <TableCell>{person.lastname}</TableCell>
                <TableCell align="right">{person.total_sales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

          

        </Container>
      );
    


}
