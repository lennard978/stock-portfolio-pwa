import React from "react";

export default function Header({ totalWealth, totalCost, totalProfit, totalDeposit, totalFees }) {
  const totalPercent = totalCost ? ((totalProfit / totalCost) * 100).toFixed(2) : "0.00";

  return (
    <header className="flex flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-4 space-y-2 sm:space-y-0">
      <div className="flex flex-col text-center sm:text-left">
        <span className="text-sm text-gray-500 dark:text-gray-400">Total Wealth</span>
        <span className="text-2xl font-bold">€{totalWealth.toFixed(2)}</span>
        <span className={`text-sm ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
          {totalProfit >= 0 ? "+" : ""}€{totalProfit.toFixed(2)} ({totalPercent >= 0 ? "+" : ""}{totalPercent}%)
        </span>
      </div>

      <div className="flex flex-col text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Total Deposit</span>
        <span className="text-2xl font-bold">€{totalDeposit.toFixed(2)}</span>
      </div>

      <div className="flex flex-col text-center sm:text-right">
        <span className="text-sm text-gray-500 dark:text-gray-400">Total Fees</span>
        <span className="text-2xl font-bold">€{totalFees.toFixed(2)}</span>
      </div>
    </header>
  );
}
