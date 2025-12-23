// components/wallet/WalletProfile.tsx
"use client";

import { useState } from "react";
import { Wallet } from "@/lib/types";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface WalletProfileProps {
  wallet: Wallet;
  currentAmount: number;
  income: number;
  expense: number;
  onSettingsClick: (wallet: Wallet) => void;
  isShared?: boolean;
  sharedBy?: string;
  userInitial?: string;
}

export function WalletProfile({ 
  wallet, 
  currentAmount, 
  income,
  expense,
  onSettingsClick,
  isShared = false,
  sharedBy,
  userInitial = "U"
}: WalletProfileProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const progress = wallet.goal > 0 ? (currentAmount / wallet.goal) * 100 : 0;
  const progressClamped = Math.min(progress, 100);
  const saving = currentAmount;

  const getProgressColor = () => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    router.push(`/wallet/${wallet.index}`);
  };

  return (
    <>
      {/* Desktop Layout */}
      <div
        className={`hidden md:block bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
          isHovered ? 'shadow-2xl scale-105' : 'shadow-lg'
        } ${isShared ? 'border-2 border-purple-400' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-4">
          {/* User Initial Circle */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-2xl font-bold text-white">
              {userInitial}
            </span>
          </div>

          {/* Wallet Name */}
          <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {wallet.name}
                </h3>
                {isShared && (
                  <p className="text-xs text-purple-600 mt-1">
                    Shared by {sharedBy}
                  </p>
                )}
              </div>
              {!isShared && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSettingsClick(wallet);
                  }}
                  className="p-2 hover:bg-white/80 rounded-lg transition-colors ml-2"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${progressClamped}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>${currentAmount.toLocaleString()}</span>
            <span>Goal: ${wallet.goal.toLocaleString()}</span>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-3 gap-3">
          {/* Income */}
          <div className="bg-green-100/80 backdrop-blur-sm rounded-xl p-3 shadow-sm">
            <p className="text-xs font-semibold text-green-700 mb-1">Income</p>
            <p className="text-lg font-bold text-green-800">
              ${income.toLocaleString()}
            </p>
          </div>

          {/* Expense */}
          <div className="bg-red-100/80 backdrop-blur-sm rounded-xl p-3 shadow-sm">
            <p className="text-xs font-semibold text-red-700 mb-1">Expense</p>
            <p className="text-lg font-bold text-red-800">
              ${expense.toLocaleString()}
            </p>
          </div>

          {/* Saving */}
          <div className="bg-blue-100/80 backdrop-blur-sm rounded-xl p-3 shadow-sm">
            <p className="text-xs font-semibold text-blue-700 mb-1">Saving</p>
            <p className="text-lg font-bold text-blue-800">
              ${saving.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className={`md:hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-lg ${
          isShared ? 'border-2 border-purple-400' : ''
        }`}
        onClick={handleCardClick}
      >
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-4">
          {/* User Initial Circle */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-lg font-bold text-white">
              {userInitial}
            </span>
          </div>

          {/* Wallet Name */}
          <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-800 truncate">
                  {wallet.name}
                </h3>
                {isShared && (
                  <p className="text-xs text-purple-600 truncate">
                    Shared by {sharedBy}
                  </p>
                )}
              </div>
              {!isShared && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSettingsClick(wallet);
                  }}
                  className="p-1.5 hover:bg-white/80 rounded-lg transition-colors ml-2 flex-shrink-0"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-700">Progress</span>
            <span className="text-xs font-bold text-gray-900">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${progressClamped}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-600">
            <span>${currentAmount.toLocaleString()}</span>
            <span>Goal: ${wallet.goal.toLocaleString()}</span>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-3 gap-2">
          {/* Income */}
          <div className="bg-green-100/80 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <p className="text-xs font-semibold text-green-700 mb-0.5">Income</p>
            <p className="text-sm font-bold text-green-800">
              ${income.toLocaleString()}
            </p>
          </div>

          {/* Expense */}
          <div className="bg-red-100/80 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <p className="text-xs font-semibold text-red-700 mb-0.5">Expense</p>
            <p className="text-sm font-bold text-red-800">
              ${expense.toLocaleString()}
            </p>
          </div>

          {/* Saving */}
          <div className="bg-blue-100/80 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <p className="text-xs font-semibold text-blue-700 mb-0.5">Saving</p>
            <p className="text-sm font-bold text-blue-800">
              ${saving.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}