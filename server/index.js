import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

// 🔑 Replace this with your Finnhub API key
const FINNHUB_API_KEY = "d3tks11r01qigeg3lumgd3tks11r01qigeg3lun0";

app.use(cors());
app.use(express.json());

// --- Search stocks by keyword (Yahoo search still works) ---
app.get("/api/search/:query", async (req, res) => {
  const { query } = req.params;

  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();

    const results = (data.quotes || [])
      .slice(0, 5)
      .map((q) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        type: q.quoteType,
      }));

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

// --- Get stock quote by symbol (Finnhub replacement) ---
app.get("/api/quote/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
    console.log("Quote URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!data.c) {
      return res.status(404).json({ error: "Symbol not found or unavailable" });
    }

    res.json({
      symbol,
      price: data.c,
      open: data.o,
      high: data.h,
      low: data.l,
      prevClose: data.pc,
      time: new Date(data.t * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Quote error:", err);
    res.status(500).json({ error: "Failed to fetch stock quote" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
