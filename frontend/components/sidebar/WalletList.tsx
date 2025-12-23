// components/sidebar/WalletList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "@/lib/types";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { AddWalletDialog } from "@/components/sidebar/AddWalletDialog";
import { walletApi } from "@/lib/api/api";

interface WalletListProps {
  wallets: Wallet[];
  onRefresh: () => void;
}

export function WalletList({ wallets, onRefresh }: WalletListProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Show 3 or 5 wallets
  const maxDisplay = 5;
  const displayedWallets = showAll ? wallets : wallets.slice(0, maxDisplay);
  const hasMoreWallets = wallets.length > maxDisplay;

  const handleCreateWallet = async (data: any) => {
    await walletApi.createWallet(data);
    onRefresh();
    setShowDialog(false);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Add Wallet Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="w-full bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Wallet</span>
        </button>

        {/* Wallet List Container */}
        {wallets.length > 0 ? (
          <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-4 shadow-lg">
            <h3 className="text-sm font-bold text-gray-800 mb-3 text-center">
              Top {Math.min(maxDisplay, wallets.length)} Using Wallets
            </h3>
            
            <div className="space-y-2">
              {displayedWallets.map((wallet, index) => (
                <button
                  key={wallet.index}
                  onClick={() => router.push(`/wallet/${wallet.index}`)}
                  className="w-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 rounded-xl p-3 flex items-center gap-3 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-bold text-sm">
                      {wallet.code.substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {wallet.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      ${wallet.goal.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    #{index + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Toggle Button */}
            {hasMoreWallets && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-3 py-2 px-4 bg-white/60 hover:bg-white/80 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Show {wallets.length - maxDisplay} More</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-8 shadow-lg text-center">
            <p className="text-gray-700 font-medium mb-3">No wallets yet</p>
            <p className="text-sm text-gray-600">
              Click "Add New Wallet" to get started!
            </p>
          </div>
        )}
      </div>

      {/* Add Wallet Dialog */}
      <AddWalletDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onCreate={handleCreateWallet}
      />
    </>
  );
}