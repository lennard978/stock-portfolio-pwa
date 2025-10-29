import React, { useState, useEffect } from "react";

export default function StockForm({ onAddStock }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [totalInvestment, setTotalInvestment] = useState("");
  const [fee, setFee] = useState("");

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/search/${query}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch current price when stock is selected
  const fetchCurrentPrice = async (symbol) => {
    try {
      const res = await fetch(`http://localhost:5000/api/quote/${symbol}`);
      const data = await res.json();
      if (data.price) {
        setCurrentPrice(data.price);
      }
    } catch (err) {
      console.error("Quote fetch error:", err);
    }
  };

  // Handle selecting a suggestion
  const handleSelectStock = (stock) => {
    setQuery(stock.name);
    setSelectedSymbol(stock.symbol);
    setSuggestions([]);
    fetchCurrentPrice(stock.symbol);
  };

  // Handle Add Stock button
  const handleAddStock = () => {
    if (!selectedSymbol || !buyPrice || !totalInvestment) return;

    const newStock = {
      id: Date.now(),
      symbol: selectedSymbol,
      name: query,
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice),
      totalInvestment: parseFloat(totalInvestment),
      fee: parseFloat(fee) || 0,
    };

    onAddStock(newStock);

    // Reset form
    setQuery("");
    setSelectedSymbol("");
    setBuyPrice("");
    setCurrentPrice("");
    setTotalInvestment("");
    setFee("");
  };

  return (
    <div className="bg-gray-900 p-4 rounded-2xl text-white shadow-md space-y-3">
      <h2 className="text-lg font-semibold mb-3">Add Stock</h2>

      {/* Stock search input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stock name"
          className="w-full p-2 rounded-md bg-gray-800 text-white outline-none"
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-gray-800 w-full mt-1 rounded-md max-h-40 overflow-y-auto z-10">
            {suggestions.map((s) => (
              <li
                key={s.symbol}
                onClick={() => handleSelectStock(s)}
                className="p-2 hover:bg-gray-700 cursor-pointer"
              >
                {s.name} ({s.symbol})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Two-line layout */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Total investment (€)"
          value={totalInvestment}
          onChange={(e) => setTotalInvestment(e.target.value)}
          className="p-2 rounded-md bg-gray-800 text-white outline-none"
        />
        <input
          type="number"
          placeholder="Fee (€)"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="p-2 rounded-md bg-gray-800 text-white outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Buy price (€)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="p-2 rounded-md bg-gray-800 text-white outline-none"
        />
        <input
          type="number"
          placeholder="Current price (€)"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="p-2 rounded-md bg-gray-800 text-white outline-none"
        />
      </div>

      <button
        onClick={handleAddStock}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-md p-2 font-semibold"
      >
        Add Stock
      </button>
    </div>
  );
}
