import React from "react";

export default function CSVControls({ stocks, setStocks }) {

  const downloadCSV = () => {
    const header = ["Name", "Symbol", "Cost", "Fee", "BuyPrice", "CurrentPrice", "Shares", "ProfitLoss", "Percent"];
    const rows = stocks.map(s => [
      s.name, s.symbol, s.cost, s.fee, s.buyPrice, s.currentPrice, s.shares, s.profitLoss, s.percent
    ]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stocks.csv";
    a.click();
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const [header, ...lines] = text.split("\n");
      const imported = lines.map(line => {
        const [name, symbol, cost, fee, buyPrice, currentPrice, shares, profitLoss, percent] = line.split(",");
        return { id: Date.now() + Math.random(), name, symbol, cost: +cost, fee: +fee, buyPrice: +buyPrice, currentPrice: +currentPrice, shares: +shares, profitLoss: +profitLoss, percent: +percent };
      });
      setStocks(prev => [...prev, ...imported]);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      <button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg">Export CSV</button>
      <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg cursor-pointer">
        Import CSV
        <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
      </label>
    </div>
  );
}
