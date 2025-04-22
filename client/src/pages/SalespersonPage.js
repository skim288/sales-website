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
import LazyTable from '../components/LazyTable'


import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');


export default function SongsPage() {
    const [pageSize, setPageSize] = useState(10);
    const [salesperson, setSalesperson] = useState([]);
    const [zip, setZip] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    

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
          .then(resJson => {
            if(resJson.length === 0){
              setError("ZIP code is invalid.")
            }else{
              setSalesperson(resJson);
            }
        })
    };

    const columns = [
      { field: 'employeeid', headerName: 'Employee ID', flex: 1, headerAlign: 'center', align: 'center' },
      { field: 'firstname', headerName: 'First Name', flex: 1, headerAlign: 'center', align: 'center' },
      { field: 'lastname', headerName: 'Last Name', flex: 1, headerAlign: 'center', align: 'center' },
      { field: 'cityname', headerName: 'City', flex: 1, headerAlign: 'center', align: 'center' },
      { field: 'zipcode', headerName: 'ZIP Code', flex: 1, headerAlign: 'center', align: 'center' },
      { field: 'total_sales', headerName: 'Total Sales', type: 'number', flex: 1, headerAlign: 'center', align: 'center' },
    ];
          
    return (
        <Container>
          <h2>Search</h2>

          
          <Grid container spacing={6}>
            <Grid item xs={8}>
              <TextField label='ZIP code' value={zip} onChange={(e) => setZip(e.target.value)} style={{ width: "100%" }}/>
            </Grid>
          </Grid>
          


          
        <Grid item xs={12} md={4} >
        <FormControl sx={{width: '65.5%'}}>
            <InputLabel id="category-label">Select Product Category </InputLabel>
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
          

        <Button
          onClick={() => search() }
          variant="contained"  style={{ marginTop: '1rem' }}
        >
          Search
        </Button>
        {error && (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            {error}
          </div>
        )}
          
         
        
          
  

    <h2 style={{ marginTop: '2rem' }}>Top Salesperson Results</h2>
      <DataGrid
        rows={salesperson}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        getRowId={(row) => row.employeeid}
      />


  </Container>
      );
    


}
