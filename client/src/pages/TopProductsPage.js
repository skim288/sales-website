import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {Container, Grid, FormControl, InputLabel, Select, MenuItem,Button} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";


const config = require("../config.json");

export default function TopProductsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [products, setProducts] = useState([]);
  const [zip, setZip] = useState('');
  const { categoryid } = useParams();
  const [searchParams] = useSearchParams();
  const categoryname = searchParams.get('categoryname');
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/top_products/${categoryid}`
    )
      .then((res) => res.json())
      .then((resJson) => setProducts(resJson));
  }, []);

  const search = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/top_products/${categoryid}?zip=${zip}` +
        `&month=${month}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if(resJson.length === 0){
          setError("ZIP code is invalid.")
        } else{
          setProducts(resJson);
        }
        
      })
  };

  const columns = [
    { field: 'productname', headerName: 'Product Name', flex: 1},
    { field: 'total_sales', headerName: 'Total Sales', type: 'number', flex: 1,  headerAlign: 'center', align: 'center'},
  ];



  const months = [
    { label: 'January', value: "1" },
    { label: 'February', value: "2" },
    { label: 'March', value: "3" },
    { label: 'April', value: "4" },
    { label: 'May', value: "5" }
  ]

  return (
    <Container>
      <h2>Search</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField
            label="ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            style={{ width: "100%" }}
          />
        </Grid>
      </Grid>


      <Grid item xs={12} md={4}>
        <FormControl sx={{ width: "65.5%" }}>
          <InputLabel id="month_label"> Select Month</InputLabel>
          <Select
            labelId="month_label"
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
          >
            {/* “None” choice */}
            <MenuItem value="">
              <Checkbox checked={month === ""} sx={{ p: 0, mr: 1 }} />
              <ListItemText primary="— None —" />
            </MenuItem>
            {months.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                <Checkbox checked={month === value} sx={{ p: 0, mr: 1 }} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>


      <Button
        onClick={() => search()}
        variant="contained"
        style={{ marginTop: "1rem" }}
      >
        Search
      </Button>
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}


      <h2 style={{ marginTop: "2rem" }}> Top {categoryname} Product Results</h2>
      <DataGrid
        rows={products}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        getRowId={(row) => row.productid}
      />
    </Container>
  );
}
