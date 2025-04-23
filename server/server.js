const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/customers/search', routes.searchCustomers); 
app.get('/sales/search', routes.searchSales); 
app.get('/top_products', routes.top_products);
app.get('/top_products/:categoryid', routes.top_products);
app.get('/top_salesperson', routes.top_salesperson);
app.get('/highest_households', routes.highest_households);
app.get('/search_employee_email', routes.search_employee_email);
app.get('/product_categories', routes.product_categories);
app.get('/monthly_sales_by_category', routes.monthly_sales_by_category);
app.get('/product_resistance', routes.product_resistance);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
