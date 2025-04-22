import { useEffect, useState } from "react";

import {
  Container,
  Grid,
  Slider,
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
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import SongCard from "../components/SongCard";
import { formatDuration } from "../helpers/formatter";
const config = require("../config.json");

export default function HouseholdPage() {
  const [pageSize, setPageSize] = useState(10);
  const [household, setHousehold] = useState([]);
  const [zip, setZip] = useState("");
  const [year, setYear] = useState("");

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
      .then((resJson) => setHousehold(resJson));
  };

  const columns = [
    { field: 'cityname', headerName: 'City Name', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'zipcode', headerName: 'ZIP Code', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'household_count', headerName: 'Household Count', flex: 1, type: 'number',  headerAlign: 'center', align: 'center' },
    { field: 'mean_income', headerName: 'Mean Income', type: 'number', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  

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
        <FormControl  sx={{width: '65.5%'}}>
          <InputLabel id="category-label">Year</InputLabel>
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

      <Grid item xs={12} md={4}>
        <Button
          onClick={() => search()}
          variant="contained"  style={{ marginTop: '1rem' }}
        >
          Search
        </Button>
      </Grid>

      <h2>Results</h2>

      <Typography variant="h4" gutterBottom>
        Top Households
      </Typography>

      <h2 style={{ marginTop: '2rem' }}>Results</h2>
      <DataGrid
        rows={household}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        getRowId={(row) => row.zipcode}
      />


      {/* <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>City Name</TableCell>
              <TableCell>ZIP Code</TableCell>
              <TableCell>Number of Households</TableCell>
              <TableCell>Mean Income</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {household.map((house) => (
              <TableRow key={house.zipcode}>
                <TableCell>{house.cityname}</TableCell>
                <TableCell>{house.zipcode}</TableCell>
                <TableCell>{house.household_count}</TableCell>
                <TableCell>{house.mean_income}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}


    </Container>
  );
}
