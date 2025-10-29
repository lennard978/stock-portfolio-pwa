import React, { useState, useEffect } from "react";

export default function StockCalculator({ onAddStock }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [totalInvestment, setTotalInvestment] = useState("");
  const [fee, setFee] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  // --- Auto search Yahoo ---
  useEffect(() => {
    if (query.length < 2) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search/${query}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  // --- Select stock and auto get current price ---
  const handleSelectStock = async (symbol) => {
    setSelectedSymbol(symbol);
    setQuery(symbol);
    setSearchResults([]);

    try {
      const res = await fetch(`http://localhost:5000/api/quote/${symbol}`);
      const data = await res.json();

      if (data.price) {
        setCurrentPrice(data.price);
      } else {
        setCurrentPrice("");
      }
    } catch (error) {
      console.error("Failed to fetch price:", error);
    }
  };

  // --- Calculate buy price automatically if possible ---
  useEffect(() => {
    if (totalInvestment && fee && currentPrice) {
      const investment = parseFloat(totalInvestment) - parseFloat(fee || 0);
      const quantity = investment / parseFloat(currentPrice);
      if (quantity > 0) {
        const buy = investment / quantity;
        setBuyPrice(buy.toFixed(2));
      }
    }
  }, [totalInvestment, fee, currentPrice]);

  const handleAdd = () => {
    if (!selectedSymbol || !buyPrice) return;

    onAddStock({
      symbol: selectedSymbol,
      totalInvestment: parseFloat(totalInvestment),
      fee: parseFloat(fee),
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice),
    });

    setQuery("");
    setSelectedSymbol("");
    setTotalInvestment("");
    setFee("");
    setBuyPrice("");
    setCurrentPrice("");
  };

  return (
    <div className="p-4 bg-gray-800 rounded-2xl shadow-md text-white">
      <h2 className="text-xl font-semibold mb-3">Add Stock</h2>

      {/* Stock search */}
      <input
        type="text"
        placeholder="Search stock..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 mb-2"
      />

      {searchResults.length > 0 && (
        <ul className="bg-gray-700 rounded mb-2">
          {searchResults.map((s) => (
            <li
              key={s.symbol}
              onClick={() => handleSelectStock(s.symbol)}
              className="p-2 cursor-pointer hover:bg-gray-600"
            >
              {s.name} ({s.symbol})
            </li>
          ))}
        </ul>
      )}

      {/* Investment + Fee in one line */}
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          placeholder="Total Investment (€)"
          value={totalInvestment}
          onChange={(e) => setTotalInvestment(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700"
        />
        <input
          type="number"
          placeholder="Fee (€)"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700"
        />
      </div>

      {/* Buy price + Current price in one line */}
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          placeholder="Buy Price (€)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700"
        />
        <input
          type="number"
          placeholder="Current Price (€)"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700"
        />
      </div>

      <button
        onClick={handleAdd}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
      >
        Add Stock
      </button>
    </div>
  );
}
