
const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Testowy endpoint główny, żeby sprawdzić czy serwer żyje
app.get('/', (req, res) => {
  res.send('Serwer Yahoo Proxy działa poprawnie!');
});

// Endpoint pobierający pełną historię
app.get('/csv/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    // Pobieramy dane historyczne od początku (1970-01-01) do dzisiaj
    const queryOptions = {
      period1: '1970-01-01',
      interval: '1d'
    };

    const result = await yahooFinance.historical(symbol, queryOptions);

    if (!result || result.length === 0) {
      return res.status(404).send('Brak danych dla podanego symbolu.');
    }

    // Konwersja tablicy obiektów JSON na format CSV
    const headers = 'Date,Open,High,Low,Close,Adj Close,Volume\n';
    const csvRows = result.map(row => {
      const date = new Date(row.date).toISOString().split('T')[0];
      const open = row.open ?? '';
      const high = row.high ?? '';
      const low = row.low ?? '';
      const close = row.close ?? '';
      const adjClose = row.adjClose ?? row.close ?? '';
      const volume = row.volume ?? 0;
      return `${date},${open},${high},${low},${close},${adjClose},${volume}`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${symbol}.csv"`);
    return res.send(headers + csvRows);

  } catch (error) {
    console.error('Błąd:', error);
    return res.status(500).send('Błąd serwera: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
