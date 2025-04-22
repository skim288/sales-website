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

  const [salesData, setSalesData] = useState([]);
  const [customerIdSales, setCustomerIdSales] = useState('');
  const [startdate, setStartdate] = useState('');
  const [enddate, setEnddate] = useState('');
  const [salesError, setSalesError] = useState('');

  const [comparisonKeyword, setComparisonKeyword] = useState('');
  const [comparisonData, setComparisonData] = useState([]);
  const [comparisonError, setComparisonError] = useState('');

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

  const searchSales = () => {
    if (!customerIdSales && (!startdate || !enddate)) {
      setSalesData([]);
      setSalesError('Please provide either a Customer ID or both Start and End Dates.');
      return;
    }

    setSalesError('');

    const queryParams = new URLSearchParams();
    if (customerIdSales) queryParams.append('customerid', customerIdSales);
    if (startdate) queryParams.append('startdate', startdate);
    if (enddate) queryParams.append('enddate', enddate);

    fetch(`http://${config.server_host}:${config.server_port}/sales/search?${queryParams.toString()}`)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.length === 0) {
          setSalesData([]);
          setSalesError('No sales records found matching your search.');
        } else {
          const salesWithId = resJson.map((s) => ({ id: s.salesid, ...s }));
          setSalesData(salesWithId);
          setSalesError('');
        }
      })
      .catch(err => {
        setSalesData([]);
        setSalesError('Failed to fetch sales data.');
      });
  };

const searchComparison = async () => {
  if (!comparisonKeyword) {
    setComparisonData([]);
    setComparisonError('Please enter a keyword to search.');
    return;
  }

  setComparisonError('');
  try {
    const headers = {
      'x-rapidapi-host': 'api-to-find-grocery-prices.p.rapidapi.com',
      'x-rapidapi-key': 'd881b16b9emshd8d18d5dba9bb3fp1da4dcjsna6c8a0e44659'
    };

    const [amazonRes, walmartRes] = await Promise.all([
      fetch(`https://api-to-find-grocery-prices.p.rapidapi.com/amazon?query=${encodeURIComponent(comparisonKeyword)}`, { headers }),
      fetch(`https://api-to-find-grocery-prices.p.rapidapi.com/walmart?query=${encodeURIComponent(comparisonKeyword)}`, { headers })
    ]);

    const amazonData = await amazonRes.json();
    const walmartData = await walmartRes.json();

    let combined = [];

    if (amazonData.products && amazonData.products.length > 0) {
      combined = combined.concat(amazonData.products.map((p, idx) => ({
        id: `amazon-${idx}`,
        name: p.name,
        price: p.price,
        source: 'Amazon',
        link: p.amazonLink
      })));
    }

    if (walmartData && walmartData.length > 0) {
      combined = combined.concat(walmartData.map((p, idx) => ({
        id: `walmart-${idx}`,
        name: p.title,
        price: p.price.currentPrice ? `$${p.price.currentPrice}` : '',
        source: 'Walmart',
        link: p.link
      })));
    }

    if (combined.length === 0) {
      setComparisonData([]);
      setComparisonError('No products found.');
    } else {
      setComparisonData(combined);
      setComparisonError('');
    }
  } catch (err) {
    console.error(err);
    setComparisonData([]);
    setComparisonError('Failed to fetch comparison data.');
  }
};

  const customerColumns = [
    { field: 'customerid', headerName: 'Customer ID', width: 120 },
    { field: 'firstname', headerName: 'First Name', width: 150 },
    { field: 'lastname', headerName: 'Last Name', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'cityname', headerName: 'City', width: 150 },
    { field: 'zipcode', headerName: 'Zip Code', width: 120 },
  ];

  const salesColumns = [
    { field: 'salesid', headerName: 'Sales ID', width: 120 },
    { field: 'customerid', headerName: 'Customer ID', width: 120 },
    { field: 'productid', headerName: 'Product ID', width: 120 },
    { field: 'productname', headerName: 'Product Name', width: 150 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'discount', headerName: 'Discount', width: 100 },
    { field: 'totalprice', headerName: 'Total Price', width: 150 },
    { field: 'salesdate', headerName: 'Sales Date', width: 180 },
  ];

  const comparisonColumns = [
    { field: 'name', headerName: 'Product Name', width: 250 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'source', headerName: 'Source', width: 100 },
    { 
      field: 'link', 
      headerName: 'Link', 
      width: 200,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          View
        </a>
      )
    }
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
        Search Customers
      </Button>

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      <h2 style={{ marginTop: '2rem' }}>Customer Results</h2>
      <DataGrid
        rows={data}
        columns={customerColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

      <h2 style={{ marginTop: '3rem' }}>Search Sales</h2>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <TextField
            label="Customer ID"
            value={customerIdSales}
            onChange={(e) => setCustomerIdSales(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Start Date (YYYY-MM-DD)"
            value={startdate}
            onChange={(e) => setStartdate(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="End Date (YYYY-MM-DD)"
            value={enddate}
            onChange={(e) => setEnddate(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
      <Button onClick={searchSales} variant="contained" style={{ marginTop: '1rem' }}>
        Search Sales
      </Button>

      {salesError && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {salesError}
        </div>
      )}

      <h2 style={{ marginTop: '2rem' }}>Sales Results</h2>
      <DataGrid
        rows={salesData}
        columns={salesColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

      <h2 style={{ marginTop: '3rem' }}>Product Price Comparison</h2>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <TextField
            label="Keyword"
            value={comparisonKeyword}
            onChange={(e) => setComparisonKeyword(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
      <Button onClick={searchComparison} variant="contained" style={{ marginTop: '1rem' }}>
        Search Product Prices
      </Button>

      {comparisonError && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {comparisonError}
        </div>
      )}

      <h2 style={{ marginTop: '2rem' }}>Product Price Comparison Results</h2>
      <DataGrid
        rows={comparisonData}
        columns={comparisonColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}