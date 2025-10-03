// app/wallet/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { walletApi, transactionApi } from "@/lib/api/api";
import { Wallet, Transaction } from "@/lib/types";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet as WalletIcon,
  ArrowUpDown,
  Filter
} from "lucide-react";

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
      // Load wallet details
      const walletsRes = await walletApi.getWallets();
      const foundWallet = walletsRes?.data?.find(
        (w: Wallet) => w.index.toString() === walletId
      );
      
      if (!foundWallet) {
        router.push("/");
        return;
      }
      
      setWallet(foundWallet);

      // Load transactions
      const txs = await transactionApi.getTransactions(parseInt(walletId));
      setTransactions(txs);

      // Calculate financials
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

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Apply sorting
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

  const getProgressPercentage = () => {
    if (!wallet || wallet.goal === 0) return 0;
    return Math.min((balance / wallet.goal) * 100, 100);
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!wallet) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{wallet.name}</h1>
                <p className="text-gray-600 mt-1">
                  Target: {wallet.target} • Code: #{wallet.code}
                </p>
              </div>
              <Button
                onClick={() => router.push(`/wallet/${walletId}/transaction`)}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Income Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Income</span>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${income.toLocaleString()}
              </p>
            </div>

            {/* Expense Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Expense</span>
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${expense.toLocaleString()}
              </p>
            </div>

            {/* Balance Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Balance</span>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <WalletIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${balance.toLocaleString()}
              </p>
            </div>

            {/* Goal Progress Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Goal</span>
                <span className="text-sm font-semibold text-blue-600">
                  {getProgressPercentage().toFixed(1)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${wallet.goal.toLocaleString()}
              </p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {getCategories().map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Sort Options */}
              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Sort by:</span>
                <button
                  onClick={() => toggleSort("date")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortField === "date"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("amount")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortField === "amount"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("category")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortField === "category"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Transactions ({filteredTransactions.length})
              </h2>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 mb-4">No transactions yet</p>
                <Button
                  onClick={() => router.push(`/wallet/${walletId}/transaction`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Your First Transaction
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.ID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {transaction.desc || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}