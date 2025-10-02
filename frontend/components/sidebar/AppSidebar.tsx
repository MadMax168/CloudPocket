// components/sidebar/AppSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { walletApi } from "@/lib/api/api";
import { Wallet } from "@/lib/types";
import { UserProf } from "@/components/sidebar/UserProf";
import { WalletList } from "@/components/sidebar/WalletList";
import { Home, LogIn, LogOut } from "lucide-react";

export function AppSidebar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadWallets();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWallets = async () => {
    try {
      const response = await walletApi.getWallets();
      setWallets(response?.data || []);
    } catch (error) {
      console.error("Failed to load wallets:", error);
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Section - User Profile */}
      <div className="p-6">
        <UserProf user={user} isAuthenticated={isAuthenticated} />
      </div>

      {/* Middle Section - Navigation & Wallets */}
      <div className="flex-1 px-4 overflow-y-auto">
        {/* Home Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center gap-3 px-4 py-3 mb-4 rounded-lg text-gray-700 hover:bg-white/50 transition-all duration-200 font-medium"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Wallets Section */}
        {isAuthenticated && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              Your Wallets
            </h3>
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                Loading...
              </div>
            ) : (
              <WalletList 
                wallets={wallets} 
                onRefresh={loadWallets}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Section - Auth Button */}
      <div className="p-4 border-t border-white/20">
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/80 hover:bg-red-600/80 text-white transition-all duration-200 font-medium backdrop-blur-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500/80 hover:bg-blue-600/80 text-white transition-all duration-200 font-medium backdrop-blur-sm"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
}