const { Pool, types } = require('pg');
const config = require('./config.json')

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

const searchCustomers = async function(req, res) {
  const { firstname, lastname } = req.query;

  if (!firstname || !lastname) {
    return res.status(400).json({ error: 'Both firstname and lastname must be provided.' });
  }

  const query = `
    SELECT c.customerid, c.firstname, c.lastname, c.address, ci.cityname, ci.zipcode
    FROM Customers c
    JOIN Cities ci ON c.cityid = ci.cityid
    WHERE LOWER(c.firstname) LIKE LOWER($1) AND LOWER(c.lastname) LIKE LOWER($2)
  `;

  const params = [`%${firstname}%`, `%${lastname}%`];

  try {
    const result = await connection.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchSales = async function(req, res) {
  const { customerid, startdate, enddate } = req.query;

  if (!customerid && (!startdate || !enddate)) {
    return res.status(400).json({ error: 'Must provide either customerid or both startdate and enddate.' });
  }

  if (customerid && (!startdate || !enddate)) {
    // Case 1: Only customerid provided
    connection.query(`
      SELECT s.salesid, s.customerid, s.productid, p.productname, p.price, s.quantity, s.discount, s.totalprice, s.salesdate
      FROM sales s
      JOIN products p ON s.productid = p.productid
      WHERE s.customerid = $1
      ORDER BY s.salesdate
    `, [customerid], (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    });

  } else if (!customerid && (startdate && enddate)) {
    // Case 2: Only startdate and enddate provided
    connection.query(`
      SELECT s.salesid, s.customerid, s.productid, p.productname, p.price, s.quantity, s.discount, s.totalprice, s.salesdate
      FROM sales s
      JOIN products p ON s.productid = p.productid
      WHERE s.salesdate BETWEEN $1 AND $2
      ORDER BY s.salesdate
    `, [startdate, enddate], (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    });

  } else if (customerid && (startdate && enddate)) {
    // Case 3: Both customerid and date range provided
    connection.query(`
      SELECT s.salesid, s.customerid, s.productid, p.productname, p.price, s.quantity, s.discount, s.totalprice, s.salesdate
      FROM sales s
      JOIN products p ON s.productid = p.productid
      WHERE s.customerid = $1
      AND s.salesdate BETWEEN $2 AND $3
      ORDER BY s.salesdate
    `, [customerid, startdate, enddate], (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json(data.rows);
      }
    });
  }
};


const top_products = async function (req, res) {
  const zip = req.query.zip ?? "";
  const month = req.query.month ?? "";
  
  // Top 5 products filtered by zipcode
  if (zip && month) {
    connection.query(
      `
      SELECT p.productid, p.productname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
            JOIN employees e ON e.employeeid=s.salespersonid
            JOIN cities c ON c.cityid=e.cityid
      WHERE c.zipcode = '${zip}' AND EXTRACT(MONTH FROM s.salesdate) = '${month}' AND p.categoryid='${req.params.categoryid}'
      GROUP BY p.productid, p.productname
      ORDER BY SUM(s.totalprice) DESC
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  }else if (zip && !month) {
    connection.query(
      `
      SELECT p.productid, p.productname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
            JOIN employees e ON e.employeeid=s.salespersonid
            JOIN cities c ON c.cityid=e.cityid
      WHERE c.zipcode = '%${zip}%' AND p.categoryid='${req.params.categoryid}'
      GROUP BY p.productid, p.productname
      ORDER BY SUM(s.totalprice) DESC
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );

    // Top 5 products (NO zipcode)
  }else if (!zip && month) {
    connection.query(
      `
      SELECT p.productid, p.productname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
            JOIN employees e ON e.employeeid=s.salespersonid
            JOIN cities c ON c.cityid=e.cityid
      WHERE EXTRACT(MONTH FROM s.salesdate) = '${month}' AND p.categoryid='${req.params.categoryid}'
      GROUP BY p.productid, p.productname
      ORDER BY SUM(s.totalprice) DESC
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  } else {
    connection.query(
      `
      SELECT p.productid, p.productname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
      WHERE p.categoryid='${req.params.categoryid}'
      GROUP BY p.productid, p.productname
      ORDER BY SUM(s.totalprice) DESC
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  }
};

// TOP 5 PRODUCT CATEGORIES with option to filter by city
// COMBINE THIS WITH THE SEARCH_PRODUCTS QUERY????
const top_product_categories = async function (req, res) {
  const zip = req.query.zip ?? "";
  const year = req.query.year ?? "";

  // top 5 product categories filtered by zipcode
  if (!zip && !year) {
    connection.query(
      `
      SELECT c.categoryname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid JOIN categories ON p.categoryid=c.categoryid
      GROUP BY 
      ORDER BY SUM(s.totalprice) DESC
      LIMIT 5
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    )


  } else if (zip && !year) {
    connection.query(
      `
      SELECT ca.categoryid, ca.categoryname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
            JOIN categories ca ON ca.categoryid=p.categoryid
            JOIN employees e ON e.emoployeeid=s.salespersonid
            JOIN cities c ON c.cityid=e.cityid
      WHERE c.zipcode = '%${zip}%'
      GROUP BY ca.categoryid, ca.categoryname
      ORDER BY total_sales DESC
      LIMIT 5
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );


  // CHANGE TO YEAR (PARSE YEAR)
  } else if(!zip && year){
    connection.query(
      `
      SELECT ca.categoryid, ca.categoryname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
            JOIN categories ca ON ca.categoryid=p.categoryid
            JOIN employees e ON e.emoployeeid=s.salespersonid
            JOIN cities c ON c.cityid=e.cityid
      WHERE c.zipcode = '%${zip}%'
      GROUP BY ca.categoryid, ca.categoryname
      ORDER BY total_sales DESC
      LIMIT 5
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );

  }else{

  }
};

const product_categories = async function (req, res) {
  connection.query(
    // returns the top salesperson per city (orders by total_sales desc, so topsalesperson in company is on top)
    `
    SELECT categoryid, categoryname, category_img_link
    FROM categories
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
  }

const top_salesperson = async function (req, res) {
  const zip = req.query.zip ?? "";
  const category = req.query.category ?? "";

  if (!zip && !category) {
    connection.query(
      // returns the top salesperson per city (orders by total_sales desc, so topsalesperson in company is on top)
      `
      SELECT employeeid, firstname, lastname, zipcode, cityname, to_char(ROUND(SUM(ts.total_sales)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM top_sales_by_product ts
      GROUP BY employeeid, firstname, lastname, zipcode, cityname
      ORDER BY SUM(ts.total_sales) DESC;
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  } else if (zip && !category) {
    connection.query(
      `
      SELECT employeeid, firstname, lastname, zipcode, cityname, to_char(ROUND(SUM(ts.total_sales)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM top_sales_by_product ts
      WHERE zipcode = '${zip}'
      GROUP BY employeeid, firstname, lastname, zipcode, cityname
      ORDER BY SUM(ts.total_sales) DESC;
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  } else if (!zip && category) {
    connection.query(
      `
      SELECT employeeid, firstname, lastname, zipcode, cityname, to_char(ROUND(total_sales::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM top_sales_by_product ts
      WHERE categoryname ILIKE '${category}'
      ORDER BY ts.total_sales DESC
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );

    // User input for both city and product category.
  } else {
    connection.query(
      `
      SELECT employeeid, firstname, lastname, zipcode, cityname, to_char(ROUND(total_sales::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM top_sales_by_product ts
      WHERE categoryname ILIKE '${category}' AND zipcode = '${zip}'
      ORDER BY ts.total_sales DESC
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  }
};


const highest_households = async function (req, res) {
  const zip = req.query.zip?? "";
  const year = req.query.year?? "";

   // Top 10 cities with the highest number of household.
  if(!zip && !year){
    connection.query(
      `
      SELECT c.cityname, c.zipcode, z.households AS household_count, z.familiesmeanincome AS mean_income
      FROM zipcodedemographics z JOIN cities c on z.zip=c.zipcode
      WHERE z.year = 2021 AND z.familiesmeanincome IS NOT NULL
      ORDER BY mean_income DESC
      LIMIT 10
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );

  // Number of household based on selected zip code.
  } else if(zip && !year){
    connection.query(
      `
      SELECT c.cityname, c.zipcode, z.households AS household_count, z.familiesmeanincome AS mean_income
      FROM zipcodedemographics z JOIN cities c on z.zip=c.zipcode
      WHERE c.zipcode = '${zip}' AND z.year = 2021 AND z.familiesmeanincome IS NOT NULL
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  // Top 10 cities with the highest number of household based on given year.
  } else if(!zip && year){
    connection.query(
      `
      SELECT c.cityname, c.zipcode, z.households AS household_count, z.familiesmeanincome AS mean_income
      FROM zipcodedemographics z JOIN cities c on z.zip=c.zipcode
      WHERE z.year = '${year}' AND z.familiesmeanincome IS NOT NULL
      ORDER BY mean_income DESC
      LIMIT 10
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  // Number of household based on given zip code and year.
  } else{
    connection.query(
      `
      SELECT c.cityname, c.zipcode, z.households AS household_count, z.familiesmeanincome AS mean_income
      FROM zipcodedemographics z JOIN cities c on z.zip=c.zipcode
      WHERE c.zipcode = '${zip}' AND z.year = '${year}' AND z.familiesmeanincome IS NOT NULL
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );

  }
  
  
  

};

const household_mean_income = async function (req, res) {
  const zip = req.query.zip?? "";
  
  // mean household income based on selected city
  if (zip) {
    connection.query(
      `
      SELECT c.cityname, c.zipcode, to_char(SUM(z.familiesmeanincome), 'FM9,999,999,999,999') AS mean_income
      FROM zipcodedemographics z JOIN cities c on z.zip=c.zipcode
      WHERE c.zipcode = '%${zip}%'
      GROUP BY c.cityname, c.zipcode
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );

    // DEFAULT: top 10 cities with the highest number of household 
  } else if(!zip){
    connection.query(
      `
      SELECT c.cityname, c.zipcode, to_char(SUM(z.familiesmeanincome), 'FM9,999,999,999,999')  AS mean_income
      FROM zipcodedemographics z JOIN cities c on z.zip=c.zipcode
      GROUP BY c.cityname, c.zipcode
      ORDER BY SUM(z.familiesmeanincome) DESC
      LIMIT 10
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.rows);
        }
      }
    );
  }
};

const search_employee_email = async function(req, res) {
  const email = req.query.email ?? "";

  // Case 2: Missing Email
  if (!email) {
    return res.status(400).json({ error: 'Email must be provided to return an Employee first and last name.' });
  }

  // Check if it's a Penn email
  const isPennEmail = email.toLowerCase().endsWith('upenn.edu');

  try {
    // If it's a Penn email, we can handle it differently
    if (isPennEmail) {
        // Extract username (part before @)
        const username = email.split('@')[0];
        // Capitalize first letter of username to make it look nicer
        const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);
        res.json([{ fullname: formattedUsername }]);
    } else {
      // Regular email lookup - only return results if found in database
      const query = `SELECT CONCAT(firstname, ' ', lastname) AS fullname FROM employees WHERE email = LOWER($1)`;
      
      connection.query(query, [email], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results.rows);
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};

// Query I
// [Complex] Top month: which month does each product category has the highest sales
// -- change to: what is the monthly sales distrition of a certain product category,
// if there is no product category selected, will show all product categories
const monthly_sales_by_category = async function(req, res) {
  const category = req.query.category;

  if (!category) {
    connection.query(`
      SELECT
        TO_CHAR(s.salesdate, 'Month') AS sales_month,
        ROUND(SUM(s.quantity * p.price)::numeric, 0) AS sales
      FROM sales s
      INNER JOIN products p ON s.productid = p.productid
      INNER JOIN categories c ON p.categoryid = c.categoryid
      // WHERE c.categoryname = $1
      GROUP BY EXTRACT(MONTH FROM s.salesdate), TO_CHAR(s.salesdate, 'Month')
      ORDER BY EXTRACT(MONTH FROM s.salesdate)
    `, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json([]);
      }
      res.json(data.rows);
    });
  } else {
    connection.query(`
      SELECT
        TO_CHAR(s.salesdate, 'Month') AS sales_month,
        ROUND(SUM(s.quantity * p.price)::numeric, 0) AS sales
      FROM sales s
      INNER JOIN products p ON s.productid = p.productid
      INNER JOIN categories c ON p.categoryid = c.categoryid
      WHERE c.categoryname = $1
      GROUP BY EXTRACT(MONTH FROM s.salesdate), TO_CHAR(s.salesdate, 'Month')
      ORDER BY EXTRACT(MONTH FROM s.salesdate)
    `, [category], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json([]);
      }
      res.json(data.rows);
    });
  }
}

const product_resistance = async function(req, res) {
  const category = req.query.category ?? "";

  connection.query(`
    SELECT
    c.categoryname,
    ROUND((SUM(CASE WHEN p.resistant = 'Durable' THEN s.quantity * p.price ELSE 0 END)
          / NULLIF(SUM(s.quantity * p.price), 0))::numeric, 2) AS resistance_perc,
    ROUND((SUM(CASE WHEN p.resistant = 'Weak' THEN s.quantity * p.price ELSE 0 END)
          / NULLIF(SUM(s.quantity * p.price), 0))::numeric, 2) AS weak_perc,
    ROUND((SUM(CASE WHEN p.resistant = 'Unknown' THEN s.quantity * p.price ELSE 0 END)
          / NULLIF(SUM(s.quantity * p.price), 0))::numeric, 2) AS unknown_perc,
    to_char(ROUND(SUM(s.quantity * p.price)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
    FROM sales s
    INNER JOIN products p ON s.productid = p.productid
    INNER JOIN categories c ON p.categoryid = c.categoryid
    WHERE c.categoryname ILIKE '${category}'
    GROUP BY c.categoryname
    ORDER BY total_sales DESC;
  `, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json(data.rows);
  });
  
}





module.exports = {
  searchCustomers,
  top_products,
  top_product_categories,
  top_salesperson,
  highest_households,
  household_mean_income,
  search_employee_email,
  product_categories,
  searchSales,
  monthly_sales_by_category,
  product_resistance
}
