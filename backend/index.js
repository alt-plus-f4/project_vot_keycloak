const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const axios = require('axios');
require('dotenv').config();

const app = express();
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(bodyParser.json());

app.use(async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const publicKey = await axios.get(`${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`);
      jwt.verify(token, publicKey.data.keys[0].x5c[0], { algorithms: ['RS256'] });
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.post('/posts', async (req, res) => {
  const { title } = req.body;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO posts (title) VALUES (?)', [title]);
    res.json({ id: result.insertId, title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
