// app/wallet/[id]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { walletApi, transactionApi } from "@/lib/api/api";
import { Wallet, Transaction } from "@/lib/types";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ExpenseSummary, EXPENSE_COLORS } from "@/components/dashboard/ExpenseSum";
import { Button } from "@/components/ui/Button";
import { Plus, TrendingUp, TrendingDown, Wallet as WalletIcon } from "lucide-react";

type SortField = "date" | "amount" | "category" | "title";
type SortOrder = "asc" | "desc";

export default function WalletDashboard() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const walletId = params.id as string;

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sorting and filtering state
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Financial calculations
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && walletId) {
      loadWalletData();
    }
  }, [isAuthenticated, walletId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [transactions, sortField, sortOrder, filterCategory, filterType]);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const walletsRes = await walletApi.getWallets();
      const foundWallet = walletsRes?.data?.find(
        (w: Wallet) => w.index.toString() === walletId
      );
      
      if (!foundWallet) {
        router.push("/");
        return;
      }
      
      setWallet(foundWallet);

      const txs = await transactionApi.getTransactions(parseInt(walletId));
      setTransactions(txs);

      const incomeTotal = txs
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenseTotal = txs
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      
      setIncome(incomeTotal);
      setExpense(expenseTotal);
      setBalance(incomeTotal - expenseTotal);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...transactions];

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredTransactions(filtered);
  };

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    return Array.from(categoryMap.entries()).map(([category, amount], index) => ({
      category,
      amount,
      color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
    }));
  }, [transactions]);

  // Calculate streak (consecutive days with transactions)
  const calculateStreak = () => {
    if (transactions.length === 0) return 0;
    
    const dates = transactions
      .map(t => new Date(t.date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const uniqueDates = Array.from(new Set(dates));
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      if (uniqueDates.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getCategories = () => {
    const categories = new Set(transactions.map((t) => t.category));
    return Array.from(categories);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!wallet) return null;

  const streak = calculateStreak();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{wallet.name}</h1>
                <p className="text-gray-600 mt-1">
                  Target: {wallet.target} • Code: #{wallet.code}
                </p>
              </div>
              <Button
                onClick={() => router.push(`/wallet/${walletId}/transaction`)}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Income & Expense Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-md p-4">
                <p className="text-sm font-semibold text-green-800 mb-1">Income</p>
                <p className="text-xl font-bold text-green-900">
                  ${income.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-md p-4">
                <p className="text-sm font-semibold text-red-800 mb-1">Expense</p>
                <p className="text-xl font-bold text-red-900">
                  ${expense.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Expense Summary */}
            <ExpenseSummary 
              expenses={expensesByCategory}
              totalBudget={wallet.goal}
            />

            {/* Streak & Saving */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-4 text-white mb-2">
                    <p className="text-sm font-semibold">Saving Amount</p>
                    <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-4 text-white">
                    <p className="text-sm font-semibold">Streak</p>
                    <p className="text-2xl font-bold">{streak} days</p>
                  </div>
                </div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center ml-4">
                  <div className="text-center text-white">
                    <p className="text-3xl font-bold">{streak}</p>
                    <p className="text-xs">days</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 rounded-xl p-3">
                <p className="text-xs text-gray-700 font-medium">Daily Check</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded ${
                        i < streak ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Transactions</h2>
                <span className="text-sm text-gray-600">
                  {filteredTransactions.length} total
                </span>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.ID}
                    className="bg-white rounded-xl p-3 shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {transaction.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <p className={`text-lg font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {transaction.type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-6">
              {/* Top Row - Stats */}
              <div className="col-span-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-800 text-sm font-semibold">Income</span>
                  <div className="p-2 bg-green-300 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-700" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-900">
                  ${income.toLocaleString()}
                </p>
              </div>

              <div className="col-span-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-800 text-sm font-semibold">Expense</span>
                  <div className="p-2 bg-red-300 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-700" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-red-900">
                  ${expense.toLocaleString()}
                </p>
              </div>

              <div className="col-span-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-800 text-sm font-semibold">Saving</span>
                  <div className="p-2 bg-blue-300 rounded-lg">
                    <WalletIcon className="w-5 h-5 text-blue-700" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  ${balance.toLocaleString()}
                </p>
              </div>

              {/* Middle Row */}
              <div className="col-span-7">
                {/* Streak Card */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Streak</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <div className="text-center text-white">
                        <p className="text-4xl font-bold">{streak}</p>
                        <p className="text-sm">days</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Daily Check-in</p>
                        <div className="flex gap-2">
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-8 rounded-lg ${
                                i < streak ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expense Summary */}
                <ExpenseSummary 
                  expenses={expensesByCategory}
                  totalBudget={wallet.goal}
                />
              </div>

              {/* Right Column - Transaction Table */}
              <div className="col-span-5 bg-white/80 backdrop-blur-md rounded-xl shadow-md max-h-[800px] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Transactions
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredTransactions.slice(0, 20).map((transaction) => (
                    <div
                      key={transaction.ID}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {transaction.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <p className={`text-xl font-bold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {transaction.type}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}