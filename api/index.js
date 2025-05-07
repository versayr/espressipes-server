const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { createClient } = require('@libsql/client')
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const port = 3000

// const corsOptions = {
//   origin: 'https://espressipes-client.vercel.app', // Replace with your specific domain
//   methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization']
// }
// 
// app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.json());

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Example: GET endpoint to fetch data
app.get('/drinks/specials', async (_, res) => {
  const result = await turso.execute("SELECT name, id FROM drinks WHERE currentSpecial = true ORDER BY created_date DSC");
  res.json(result);
});

app.get('/drinks', async (_, res) => {
  const result = await turso.execute("SELECT name, id FROM drinks ORDER BY name ASC");
  res.json(result);
});

app.get('/drinks/:id', async (req, res) => {
  const id = req.params.id;
  const result = await turso.execute(`SELECT * FROM drinks WHERE id = ${id}`);
  res.json(result.rows);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
