const express = require('express');
const axios = require('axios'); 
const app = express();
const port = 3000;

app.use(express.json());

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0Njg0LCJpYXQiOjE3NDQ5NTQzODQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjRmZGJiMGFkLTI2MTctNGExMC1iYzFiLTA3N2M3OTMwMzZjZiIsInN1YiI6InJ1ZHJhLmd1cHRhX2NzMjJAZ2xhLmFjLmluIn0sImVtYWlsIjoicnVkcmEuZ3VwdGFfY3MyMkBnbGEuYWMuaW4iLCJuYW1lIjoicnVkcmEgZ3VwdGEiLCJyb2xsTm8iOiIyMjE1MDAxNTAxIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNGZkYmIwYWQtMjYxNy00YTEwLWJjMWItMDc3Yzc5MzAzNmNmIiwiY2xpZW50U2VjcmV0IjoiZWZaUVdrVnNSZlF1cWFZaCJ9.Ce0qvki2oiqQacSaHGBaBvIkfIV81m6tHZLXoEPQUxg';

app.get('/api/users', async (req, res) => {
  try {
    const response = await axios.get('http://20.244.56.144/evaluation-service/users', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error calling third-party API:', error.message);
    res.status(500).json({ error: 'Failed to fetch users from third-party API' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
