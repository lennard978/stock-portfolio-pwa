import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StockForm from "./components/StockForm";
import StockList from "./components/StockList";
import CSVControls from "./components/CSVControls";

const STORAGE_KEY = "stock_portfolio_v2";

export default function App() {
  const [stocks, setStocks] = useState([]);

  // Load from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setStocks(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever stocks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }, [stocks]);

  // Add new stock
  const handleAddStock = (newStock) => {
    setStocks((prev) => [...prev, newStock]);
  };

  // Simple totals for header (optional placeholders)
  const totalWealth = stocks.reduce((sum, s) => sum + (Number(s.currentPrice) || 0), 0);
  const totalCost = stocks.reduce((sum, s) => sum + (Number(s.buyPrice) || 0), 0);
  const totalProfit = totalWealth - totalCost;
  const totalDeposit = stocks.reduce((sum, s) => sum + (Number(s.totalInvestment) || 0), 0);
  const totalFees = stocks.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <Header
        totalWealth={totalWealth}
        totalCost={totalCost}
        totalProfit={totalProfit}
        totalDeposit={totalDeposit}
        totalFees={totalFees}
      />

      <div className="p-4 max-w-md mx-auto">
        {/* The form with current price auto-fill */}
        <StockForm onAddStock={handleAddStock} />

        {/* CSV and Stock List */}
        <div className="flex justify-between items-center mt-4 mb-2">
          <h2 className="text-xl font-bold">Stocks</h2>
          <CSVControls stocks={stocks} setStocks={setStocks} />
        </div>

        <StockList stocks={stocks} setStocks={setStocks} />
      </div>
    </div>
  );
}
