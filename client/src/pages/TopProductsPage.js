import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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

export default function TopProductsPage() {
  const [products, setProducts] = useState([]);
  const [zip, setZip] = useState("");
  const [year, setYear] = useState("");
  const { categoryid } = useParams();
  const [searchParams] = useSearchParams();
  const categoryname = searchParams.get('categoryname');
  const [month, setMonth] = useState("");

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
      .then((resJson) => setProducts(resJson));
  };

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
        <FormControl fullWidth>
          <InputLabel id="month_label">Month</InputLabel>
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
            {months.map(({label, value}) => (
              <MenuItem key={value} value={value}>
                <Checkbox checked={month === value} sx={{ p: 0, mr: 1 }} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <Button
          onClick={() => search()}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          Search
        </Button>
      </Grid>

      <h2>Results</h2>

      <Typography variant="h4" gutterBottom>
        Top {categoryname} Products
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Total Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productid}>
                <TableCell>{product.productname}</TableCell>
                <TableCell>{product.total_sales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
