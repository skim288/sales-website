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

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
// author stores the callback function that has 2 parameters:
//    1) req (request object): contains any info the user sends to the server such as route parameters
//    2) res (response object): send info that was requested to the client
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennkey with your own
  const name = 'Stephen Kim';
  const pennkey = 'skim';

  // checks the value of type in the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.json returns data back to the requester via an HTTP response
    res.json({ data: name });
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back a JSON response with the pennkey
    res.json({ data: pennkey});
  } else {
    res.status(400).json({});
  }
}

// Route 2: GET /random
// Returns a random song
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0; // test the query parameter: explicit

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  // in the database: explicit songs = 1, non-explicit songs = 0
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RANDOM()
    LIMIT 1
  `, (err, data) => { /* the 2nd parameter/object for the connection.query() function is a callback function
                       ... that will be called once the query is executed
                       ... err: holds error if query fails
                       ... data: holds the query result (return table from query)
                      */                
    if (err) {
      // If there is an error for some reason, print the error message and
      // return an empty object instead
      console.log(err);
      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
      // return type you may need to return an empty array [] instead.
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data.rows[0])
      // TODO (TASK 3): also return the song title in the response
      // TO JUST RETURN AN ARRAY, RETURN data INSTEAD OF data.rows[0].attribute_name
      res.json({
        song_id: data.rows[0].song_id, // RECALL:: data variable holds the query result
        title: data.rows[0].title
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
// Return all information about a song
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data.rows[0]
  // Most of the code is already written for you, you just need to fill in the query
  connection.query(`
    SELECT *
    FROM Songs
    WHERE song_id = '${req.params.song_id}'
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows[0]);
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  connection.query(`
    SELECT *
    FROM Albums
    WHERE album_id = '${req.params.album_id}'
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json({});
    } else{
      res.json(data.rows[0])
    }
  });
}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(`
    SELECT *
    FROM Albums
    ORDER BY release_date DESC
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json({});
    } else{
      res.json(data.rows) // Returns array
    }
  })
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  connection.query(`
    SELECT S.song_id, S.title, S.number, S.duration, S.plays
    FROM Albums A JOIN Songs S ON A.album_id = S.album_id
    WHERE S.album_id = '${req.params.album_id}'
    ORDER BY S.number ASC
  `, (err, data) => {
    if(err){
      console.log(err);
      res.json({});
    } else{
      res.json(data.rows)
    }
  })
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ? parseInt(req.query.page_size, 10) : 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
      SELECT S.song_id, S.title, A.album_id, A.title AS album, S.plays
      FROM Songs S JOIN Albums A ON S.album_id = A.album_id
      ORDER BY S.plays DESC
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows)
      }
    })
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    connection.query(`
      SELECT S.song_id, S.title, A.album_id, A.title AS album, S.plays
      FROM Songs S JOIN Albums A ON S.album_id = A.album_id
      ORDER BY S.plays DESC
      LIMIT ${pageSize} OFFSET ${((parseInt(page, 10) - 1) * pageSize)}
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows);
      }
    })
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;
  const pageSize = req.query.page_size ? parseInt(req.query.page_size, 10) : 10;

  if(!page){
    connection.query(`
      SELECT A.album_id, A.title, SUM(S.plays) AS plays
      FROM Albums A JOIN Songs S ON A.album_id = S.album_id
      GROUP BY A.album_id, A.title
      ORDER BY plays DESC
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows);
      }
    })
  } else{
    connection.query(`
      SELECT A.album_id, A.title, SUM(S.plays) AS plays
      FROM Albums A JOIN Songs S ON A.album_id = S.album_id
      GROUP BY A.album_id, A.title
      ORDER BY plays DESC
      LIMIT ${pageSize} OFFSET ${((parseInt(page, 10) - 1) * pageSize)} 
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows);
      }
    })
  }
  
}

// Route 9: GET /search_songs
const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const playsLow = req.query.plays_low ?? 0;
  const playsHigh = req.query.plays_high ?? 1100000000;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Title IS specified AND explicit is NOT defined or does NOT equal "true"
  if(title && !explicit){
    connection.query(`
      SELECT *
      FROM Songs
      WHERE title LIKE '%${title}%' AND explicit = 0
      AND duration >= ${parseInt(durationLow, 10)} AND duration <= ${parseInt(durationHigh, 10)}
      AND plays >= ${parseInt(playsLow, 10)} AND duration <= ${parseInt(playsHigh, 10)}
      AND danceability >= ${parseFloat(danceabilityLow)} AND danceability <= ${parseFloat(danceabilityHigh)}
      AND energy >= ${parseFloat(energyLow)} AND energy <= ${parseFloat(energyHigh)}
      AND valence >= ${parseFloat(valenceLow)} AND valence <= ${parseFloat(valenceHigh)}
      ORDER BY title ASC
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows);
      }
    })
  // Title IS specified AND explicit equals "true"
  } else if(title && explicit){
    connection.query(`
      SELECT *
      FROM Songs
      WHERE title LIKE '%${title}%'
      AND duration >= ${parseInt(durationLow, 10)} AND duration <= ${parseInt(durationHigh, 10)}
      AND plays >= ${parseInt(playsLow, 10)} AND duration <= ${parseInt(playsHigh, 10)}
      AND danceability >= ${parseFloat(danceabilityLow)} AND danceability <= ${parseFloat(danceabilityHigh)}
      AND energy >= ${parseFloat(energyLow)} AND energy <= ${parseFloat(energyHigh)}
      AND valence >= ${parseFloat(valenceLow)} AND valence <= ${parseFloat(valenceHigh)}
      ORDER BY title ASC
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows);
      }
    })
  // Title is NOT specified AND explicit is NOT defined or does NOT equal "true"
  } else if(!title && !explicit){
    connection.query(`
      SELECT *
      FROM Songs
      WHERE explicit = 0
      AND duration >= ${parseInt(durationLow, 10)} AND duration <= ${parseInt(durationHigh, 10)}
      AND plays >= ${parseInt(playsLow, 10)} AND duration <= ${parseInt(playsHigh, 10)}
      AND danceability >= ${parseFloat(danceabilityLow)} AND danceability <= ${parseFloat(danceabilityHigh)}
      AND energy >= ${parseFloat(energyLow)} AND energy <= ${parseFloat(energyHigh)}
      AND valence >= ${parseFloat(valenceLow)} AND valence <= ${parseFloat(valenceHigh)}
      ORDER BY title ASC
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows);
      }
    })
  // Title is NOT specified and explicit equals "true"
  } else{
    connection.query(`
      SELECT *
      FROM Songs
      WHERE duration >= ${parseInt(durationLow, 10)} AND duration <= ${parseInt(durationHigh, 10)}
      AND plays >= ${parseInt(playsLow, 10)} AND duration <= ${parseInt(playsHigh, 10)}
      AND danceability >= ${parseFloat(danceabilityLow)} AND danceability <= ${parseFloat(danceabilityHigh)}
      AND energy >= ${parseFloat(energyLow)} AND energy <= ${parseFloat(energyHigh)}
      AND valence >= ${parseFloat(valenceLow)} AND valence <= ${parseFloat(valenceHigh)}
      ORDER BY title ASC
    `, (err, data) => {
      if(err){
        console.log(err);
        res.json([]);
      } else{
        res.json(data.rows);
      }
    })
  }
}

const searchCustomers = async function(req, res) {
  const { firstname, lastname } = req.query;

  // Case 2: Missing firstname or lastname
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
    // Case 3: Return empty array if no results
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// TOP PRODUCTS with option to filter by zipcode
const top_products = async function (req, res) {
  const zip = req.query.zip ?? "";
  // ALLOWS US TO FILTER BY DATE
  const dateLow = req.query.dateLow?? ""; //replace '' with a default date here (look at datagrip format)
  const dateHigh = req.query.dateHigh ?? ""; //replace '' with a default date here (look at datagrip format)

  // Top 5 products filtered by zipcode
  if (zip) {
    connection.query(
      `
      SELECT p.productid, p.productname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
            JOIN employees e ON e.employeeid=s.salespersonid
            JOIN cities c ON c.cityid=e.cityid
      WHERE c.zipcode = '%${zip}%'
      GROUP BY p.productid, p.productname
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
    );

    // Top 5 products (NO zipcode)
  } else {
    connection.query(
      `
      SELECT p.productid, p.productname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales
      FROM sales s JOIN products p ON s.productid=p.productid
      GROUP BY p.productid, p.productname
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

const top_salesperson = async function (req, res) {
  const zip = req.query.zip ?? "";
  const category = req.query.category ?? "";

  if (!zip && !category) {
    connection.query(
      // returns the top salesperson per city (orders by total_sales desc, so topsalesperson in company is on top)
      `
      SELECT ci.cityname,  e.employeeid, e.firstname, e.lastname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales, RANK() OVER (PARTITION BY ci.cityname ORDER BY SUM(s.totalprice)DESC) AS rank_in_city
      FROM sales s JOIN employees e on s.salespersonid=e.employeeid
          JOIN cities ci ON e.cityid=ci.cityid
      GROUP BY ci.cityname, e.employeeid, e.firstname, e.lastname
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
  } else if (zip && !category) {
    connection.query(
      `
      SELECT ci.zipcode, e.employeeid, e.firstname, e.lastname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales, RANK() OVER (PARTITION BY ci.cityname ORDER BY SUM(s.totalprice)DESC) AS rank_in_city
      FROM sales s JOIN employees e on s.salespersonid=e.employeeid
          JOIN cities ci ON e.cityid=ci.cityid
      WHERE zipcode = '${zip}'
      GROUP BY ci.zipcode, ci.cityname, e.employeeid, e.firstname, e.lastname
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
  } else if (!zip && category) {
    connection.query(
      `
      SELECT c.categoryname, e.employeeid, e.firstname, e.lastname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales, RANK() OVER (PARTITION BY c.categoryid ORDER BY SUM(s.totalprice) DESC) AS rank_in_category
      FROM sales s JOIN employees e on s.salespersonid=e.employeeid
          JOIN products p ON s.productid=p.productid
          JOIN categories c on p.categoryid=c.categoryid
      WHERE categoryname ILIKE '${category}'
      GROUP BY c.categoryname, e.employeeid, e.firstname, e.lastname, c.categoryid
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

    // User input for both city and product category.
  } else {
    connection.query(
      `
      SELECT e.employeeid, e.firstname, e.lastname, to_char(ROUND(SUM(s.totalprice)::numeric, 0), 'FM9,999,999,999,999') AS total_sales, RANK() OVER (PARTITION BY c.categoryid ORDER BY SUM(s.totalprice) DESC) AS rank_in_category
      FROM sales s JOIN employees e on s.salespersonid=e.employeeid
          JOIN cities ci ON e.cityid=ci.cityid
          JOIN products p ON s.productid=p.productid
          JOIN categories c on p.categoryid=c.categoryid
      WHERE c.categoryname ILIKE 'Dairy' AND zipcode = '81251'
      GROUP BY e.employeeid, e.firstname, e.lastname, c.categoryid
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

module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
  searchCustomers,
  top_products,
  top_product_categories,
  top_salesperson,
  highest_households,
  household_mean_income,
}
