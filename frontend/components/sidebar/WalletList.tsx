// components/sidebar/WalletList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "@/lib/types";
import { Plus, ChevronRight, Wallet as WalletIcon } from "lucide-react";
import { AddWalletBut } from "@/components/wallet/AddWallet";
import { walletApi } from "@/lib/api/api";

interface WalletListProps {
  wallets: Wallet[];
  onRefresh: () => void;
}

export function WalletList({ wallets, onRefresh }: WalletListProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  // Show only 3 wallets initially
  const displayedWallets = showAll ? wallets : wallets.slice(0, 3);
  const hasMoreWallets = wallets.length > 3;

  const handleCreateWallet = async (data: any) => {
    await walletApi.createWallet(data);
    onRefresh();
  };

  if (wallets.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-100 flex items-center justify-center">
            <WalletIcon className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-3">No wallets yet</p>
        </div>
        <AddWalletBut onCreate={handleCreateWallet} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayedWallets.map((wallet) => (
        <button
          key={wallet.index}
          onClick={() => router.push(`/wallet/${wallet.index}`)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-white/50 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {wallet.code.substring(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 text-sm truncate">
              {wallet.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Goal: ${wallet.goal.toLocaleString()}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
        </button>
      ))}

      {/* Show More/Less Button */}
      {hasMoreWallets && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {showAll ? "Show Less" : `Show ${wallets.length - 3} More`}
        </button>
      )}

      {/* Add Wallet Button */}
      <div className="pt-2">
        <AddWalletBut onCreate={handleCreateWallet} />
      </div>
    </div>
  );
}