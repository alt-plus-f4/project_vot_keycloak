const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(bodyParser.json());

const getKeycloakPublicKey = async () => {
  try {
    
    const link = `http://localhost:8080/realms/master/protocol/openid-connect/certs`;

    const response = await axios.get(link);
    console.log(response.data);

    const key = response.data.keys[0].x5c[0];
    return `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`;
  } catch (error) {
    throw new Error('Unable to get Keycloak public key');
  }
};

const verifyToken = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const publicKey = await getKeycloakPublicKey();
      await jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      console.log('Token is valid');
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ error: 'Expired or invalid token' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.use(verifyToken);

app.get('/posts', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM posts');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/posts', async (req, res) => {
  const { title } = req.body;
  console.log('Title:', title);
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO posts (title) VALUES (?)', [title]);
    res.json({ id: result.insertId, title });
  } catch (err) {
    console.error('Post creation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
