// components/sidebar/MobileSidebarMenu.tsx
"use client";

import { useRouter } from "next/navigation";
import { User, Wallet } from "@/lib/types";
import { X, LogIn, LogOut, Plus, Home } from "lucide-react";
import { AddWalletDialog } from "@/components/sidebar/AddWalletDialog";
import { useState } from "react";
import { walletApi } from "@/lib/api/api";

interface MobileSidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isAuthenticated: boolean;
  wallets: Wallet[];
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export function MobileSidebarMenu({
  isOpen,
  onClose,
  user,
  isAuthenticated,
  wallets,
  loading,
  onRefresh,
  onLogout,
}: MobileSidebarMenuProps) {
  const router = useRouter();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleCreateWallet = async (data: any) => {
    await walletApi.createWallet(data);
    onRefresh();
    setShowAddDialog(false);
  };

  const handleWalletClick = (walletId: number) => {
    router.push(`/wallet/${walletId}`);
    onClose();
  };

  const handleHomeClick = () => {
    router.push("/");
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Bubble Menu */}
      <div className="md:hidden fixed top-20 left-4 right-4 z-50 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* User Info */}
          {isAuthenticated && user ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="font-semibold text-gray-800">Guest</p>
              <p className="text-xs text-gray-600">Please log in</p>
            </div>
          )}

          {/* Home Button */}
          <button
            onClick={handleHomeClick}
            className="w-full bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          {/* Add Wallet Button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowAddDialog(true)}
              className="w-full bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Wallet</span>
            </button>
          )}

          {/* Wallets List */}
          {isAuthenticated && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Your Wallets</h3>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto"></div>
                </div>
              ) : wallets.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-2">No wallets yet</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {wallets.slice(0, 5).map((wallet, index) => (
                    <button
                      key={wallet.index}
                      onClick={() => handleWalletClick(wallet.index)}
                      className="w-full bg-white hover:bg-gray-50 rounded-xl p-3 flex items-center gap-3 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
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
                  {wallets.length > 5 && (
                    <p className="text-xs text-center text-gray-500 py-2">
                      +{wallets.length - 5} more wallets
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                router.push("/auth/login");
                onClose();
              }}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Wallet Dialog */}
      <AddWalletDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onCreate={handleCreateWallet}
      />
    </>
  );
}