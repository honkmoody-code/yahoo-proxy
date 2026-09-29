const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Główna strona powitalna
app.get('/', (req, res) => {
  res.send('Serwer Yahoo Proxy działa!');
});

// Endpoint do pobierania CSV
app.get('/csv/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    
    // Wymuszenie pobrania danych historycznych od 1970 r.
    const result = await yahooFinance.chart(symbol, {
      period1: '1970-01-01',
      interval: '1d'
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      return res.status(404).send('Brak danych dla symbolu: ' + symbol);
    }

    // Nagłówek pliku CSV
    let csv = 'Date,Open,High,Low,Close,Volume\n';

    // Generowanie wierszy CSV
    for (const q of result.quotes) {
      if (q.date && q.close !== null) {
        const dateStr = new Date(q.date).toISOString().split('T')[0];
        csv += `${dateStr},${q.open ?? ''},${q.high ?? ''},${q.low ?? ''},${q.close ?? ''},${q.volume ?? 0}\n`;
      }
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${symbol}.csv"`);
    return res.send(csv);

  } catch (err) {
    console.error(err);
    return res.status(500).send('Błąd pobierania danych: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
