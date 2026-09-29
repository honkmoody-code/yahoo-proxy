const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const HEADERS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

// Pobieranie danych CSV z Yahoo Finance
app.get('/csv/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // Domyślnie p
    const yahooUrl =obieramy ostatnie 365 dni
    const now = Math.floor(Date.now() / 1000);
    const oneYearAgo = now - 365 * 24 * 60 * 60;
 `https://query1.finance.yahoo.com/v7/finance/download/${encodeURIComponent(symbol)}?period1=${oneYearAgo}&period2=${now}&interval=1d&events=history`;

    const response = await axios.get(yahooUrl, HEADERS);

    res.setHeader('Content-Type', 'text/csv');
    return res.send(response.data);
  } catch (error) {
    return res.status(500).send('Błąd pobierania danych z Yahoo Finance: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

const HEADERS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

// Endpoint pobierający dane od samego początku do dziś
app.get('/csv/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // period1 = 0 oznacza początek historii dostępnej na Yahoo Finance (od ok. 1970 r.)
    const period1 = 0; 
    // period2 = aktualny czas Unix
    const period2 = Math.floor(Date.now() / 1000); 

    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/download/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1d&events=history&includeAdjustedClose=true`;

    const response = await axios.get(yahooUrl, HEADERS);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${symbol}_max.csv"`);
    return res.send(response.data);
  } catch (error) {
    console.error('Błąd:', error.message);
    return res.status(500).send('Błąd pobierania danych z Yahoo Finance: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
