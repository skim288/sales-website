import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


const config = require('../config.json');

export default function CustomerPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState('');

  const search = () => {
    if (!firstname || !lastname) {
      setData([]); 
      setError('Please enter both first and last name.');
      return;
    }

    setError('');

    fetch(`http://${config.server_host}:${config.server_port}/customers/search?firstname=${firstname}&lastname=${lastname}`)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.length === 0) {
          setData([]);
          setError('No customers found matching your search.');
        } else {
          const customersWithId = resJson.map((c) => ({ id: c.customerid, ...c }));
          setData(customersWithId);
          setError('');
        }
      })
      .catch(err => {
        setData([]);
        setError('Failed to fetch customers.');
      });
  };

  const columns = [
    { field: 'customerid', headerName: 'Customer ID', width: 120 },
    { field: 'firstname', headerName: 'First Name', width: 150 },
    { field: 'lastname', headerName: 'Last Name', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'cityname', headerName: 'City', width: 150 },
    { field: 'zipcode', headerName: 'Zip Code', width: 120 },
  ];

  return (
    <Container>
      <h2>Search Customers</h2>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
      <Button onClick={search} variant="contained" style={{ marginTop: '1rem' }}>
        Search
      </Button>

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      <h2 style={{ marginTop: '2rem' }}>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}