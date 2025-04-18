const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;


const WINDOW_SIZE = 10;
const TEST_SERVER = 'http://20.244.56.144/evaluation-service';
const TIMEOUT = 500; 


const numberStore = {
  p: [], 
  f: [], 
  e: [], 
  r: []
};


function addUniqueNumbers(type, newNumbers) {
  const store = numberStore[type];
  
  for (const num of newNumbers) {

    if (!store.includes(num)) {
      if (store.length >= WINDOW_SIZE) {
        store.shift();
      }
      store.push(num);
    }
  }
}

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
}

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  
  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r.' });
  }
  
  const endpoints = {
    p: `${TEST_SERVER}/primes`,
    f: `${TEST_SERVER}/fibo`,
    e: `${TEST_SERVER}/even`,
    r: `${TEST_SERVER}/rand`
  };
  
  try {
    const response = await axios.get(endpoints[numberid], { timeout: TIMEOUT });
    
    if (response.data && Array.isArray(response.data.numbers)) {
      const windowPrevState = [...numberStore[numberid]];
      
      addUniqueNumbers(numberid, response.data.numbers);
      
      const result = {
        windowPrevState,
        windowCurrState: [...numberStore[numberid]],
        numbers: response.data.numbers,
        avg: calculateAverage(numberStore[numberid])
      };
      
      res.json(result);
    } else {
      res.status(500).json({ error: 'Invalid response from third-party server' });
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Request timeout', windowState: numberStore[numberid] });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch numbers', 
        message: error.message,
        windowState: numberStore[numberid]
      });
    }
  }
});
app.listen(port, () => {
  console.log(`Average Calculator microservice running at http://localhost:${port}`);
});