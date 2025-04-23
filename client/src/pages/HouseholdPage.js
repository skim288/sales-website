import { useEffect, useState } from "react";

import {Container, Grid, FormControl, InputLabel, Select, MenuItem, Button} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const config = require("../config.json");

export default function HouseholdPage() {
  const [pageSize, setPageSize] = useState(10);
  const [household, setHousehold] = useState([]);
  const [zip, setZip] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/highest_households`
    )
      .then((res) => res.json())
      .then((resJson) => setHousehold(resJson));
  }, []);

  const search = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/highest_households?zip=${zip}` +
        `&year=${year}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.length === 0) {
          setError("ZIP code is invalid.");
        } else {
          setHousehold(resJson);
        }
      });
  };


  const columns = [
    { field: 'cityname', headerName: 'City Name', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'zipcode', headerName: 'ZIP Code', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'household_count', headerName: 'Household Count', flex: 1, type: 'number',  headerAlign: 'center', align: 'center' },
    { field: 'mean_income', headerName: 'Mean Income', type: 'number', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  // Columns to be displayed in results table.

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
          <InputLabel id="category-label">Select Year</InputLabel>
          <Select
            labelId="category-label"
            value={year}
            label="Product Category"
            onChange={(e) => setYear(e.target.value)}
          >
            {/* “None” choice */}
            <MenuItem value="">
              <Checkbox checked={year === ""} sx={{ p: 0, mr: 1 }} />
              <ListItemText primary="— None —" />
            </MenuItem>
            {[
              "2011",
              "2012",
              "2013",
              "2014",
              "2015",
              "2016",
              "2017",
              "2018",
              "2019",
              "2020",
              "2021",
            ].map((item) => (
              <MenuItem key={item} value={item}>
                <Checkbox checked={year === item} sx={{ p: 0, mr: 1 }} />
                <ListItemText primary={item} />
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


      <h2 style={{ marginTop: "2rem" }}>Top Households Results</h2>
      <DataGrid
        rows={household}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        getRowId={(row) => row.zipcode}
      />
    </Container>
  );
}
