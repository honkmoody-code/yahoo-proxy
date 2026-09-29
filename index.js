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
    // Domyślnie pobieramy ostatnie 365 dni
    const now = Math.floor(Date.now() / 1000);
    const oneYearAgo = now - 365 * 24 * 60 * 60;

    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/download/${encodeURIComponent(symbol)}?period1=${oneYearAgo}&period2=${now}&interval=1d&events=history`;

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