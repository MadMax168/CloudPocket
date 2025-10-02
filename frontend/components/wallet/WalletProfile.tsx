// components/wallet/WalletProfile.tsx
"use client";

import { useState } from "react";
import { Wallet } from "@/lib/types";
import { Settings, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface WalletProfileProps {
  wallet: Wallet;
  currentAmount: number;
  onSettingsClick: (wallet: Wallet) => void;
  isShared?: boolean;
  sharedBy?: string;
}

export function WalletProfile({ 
  wallet, 
  currentAmount, 
  onSettingsClick,
  isShared = false,
  sharedBy
}: WalletProfileProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const progress = wallet.goal > 0 ? (currentAmount / wallet.goal) * 100 : 0;
  const progressClamped = Math.min(progress, 100);

  const getProgressColor = () => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on settings button
    if ((e.target as HTMLElement).closest('button')) return;
    router.push(`/wallet/${wallet.index}`);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 ${
        isHovered ? 'shadow-xl scale-105' : ''
      } ${isShared ? 'border-l-4 border-purple-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-800">{wallet.name}</h3>
            {isShared && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                Shared
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Code: #{wallet.code}</p>
          {sharedBy && (
            <p className="text-xs text-purple-600 mt-1">Shared by {sharedBy}</p>
          )}
        </div>

        {/* Settings Button - Only show if not shared */}
        {!isShared && (
          <button
            onClick={() => onSettingsClick(wallet)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Target Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <TrendingUp className="w-4 h-4" />
          <span>Target: {wallet.target}</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-gray-800">
              ${currentAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Current Savings</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-600">
              ${wallet.goal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Goal</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
              style={{ width: `${progressClamped}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1 text-right">
            {progress.toFixed(1)}% Complete
          </p>
        </div>

        {/* Remaining Amount or Goal Achieved */}
        {currentAmount < wallet.goal ? (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">
                ${(wallet.goal - currentAmount).toLocaleString()}
              </span>{" "}
              remaining to reach your goal
            </p>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-semibold">
              🎉 Goal Achieved!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}