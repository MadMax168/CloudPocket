// components/dashboard/ExpenseSummary.tsx
"use client";

import { useMemo } from "react";

interface ExpenseCategory {
  category: string;
  amount: number;
  color: string;
}

interface ExpenseSummaryProps {
  expenses: ExpenseCategory[];
  totalBudget?: number;
}

export function ExpenseSummary({ expenses, totalBudget }: ExpenseSummaryProps) {
  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // Calculate circle properties
  const getCircleProgress = (amount: number, index: number) => {
    const percentage = totalBudget ? (amount / totalBudget) * 100 : 0;
    const radius = 80 - index * 15; // Decreasing radius for each ring
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return { radius, circumference, strokeDashoffset, percentage };
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg">
      {/* Title */}
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl p-4 mb-6 text-center">
        <h2 className="text-white text-xl font-bold">All Expense</h2>
        <p className="text-white/80 text-sm mt-1">
          ${totalExpense.toLocaleString()} total
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Circular Progress Bars */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            <svg
              className="transform -rotate-90 w-full h-full"
              viewBox="0 0 200 200"
            >
              {sortedExpenses.slice(0, 4).map((expense, index) => {
                const { radius, circumference, strokeDashoffset } = getCircleProgress(
                  expense.amount,
                  index
                );
                
                return (
                  <g key={expense.category}>
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={expense.color}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-gray-600 font-medium">Total Expense</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalExpense.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Category List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-4">
            Expense Breakdown
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sortedExpenses.map((expense, index) => {
              const percentage = totalExpense > 0 
                ? ((expense.amount / totalExpense) * 100).toFixed(1)
                : 0;
              
              return (
                <div
                  key={expense.category}
                  className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: expense.color }}
                      />
                      <span className="font-semibold text-gray-900 text-sm">
                        {expense.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-600">
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </p>
                    {index < 3 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Top {index + 1}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Predefined color palette for categories
export const EXPENSE_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];