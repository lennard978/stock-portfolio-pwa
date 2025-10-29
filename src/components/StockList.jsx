import React from "react";

export default function StockList({ stocks }) {
  return (
    <div className="mt-6 bg-gray-900 p-4 rounded-2xl text-white">
      <h2 className="text-lg font-semibold mb-3">My Stocks</h2>
      {stocks.length === 0 ? (
        <p className="text-gray-400">No stocks added yet.</p>
      ) : (
        <ul className="space-y-2">
          {stocks.map((s) => (
            <li key={s.id} className="p-2 bg-gray-800 rounded-lg flex justify-between">
              <div>
                <strong>{s.symbol}</strong>
                <div className="text-sm text-gray-400">
                  Buy: €{s.buyPrice} | Current: €{s.currentPrice}
                </div>
              </div>
              <div className="text-right">
                <div>Invested: €{s.totalInvestment}</div>
                <div className="text-sm text-gray-400">Fee: €{s.fee}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
