// components/sidebar/AppSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { walletApi } from "@/lib/api/api";
import { Wallet } from "@/lib/types";
import { UserProf } from "@/components/sidebar/UserProf";
import { WalletList } from "@/components/sidebar/WalletList";
import { MobileSidebarMenu } from "@/components/sidebar/MobileSidebarMenu";
import { LogIn, LogOut, Menu } from "lucide-react";

export function AppSidebar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex h-screen w-80 flex-col bg-gradient-to-b from-gray-100 to-gray-200 border-r border-gray-300 shadow-xl">
        {/* Top Section - User Profile */}
        <div className="p-6">
          <UserProf user={user} isAuthenticated={isAuthenticated} />
        </div>

        {/* Middle Section - Wallets */}
        <div className="flex-1 px-6 overflow-y-auto">
          {isAuthenticated && (
            <div className="mb-4">
              {loading ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
                  Loading wallets...
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

        {/* Bottom Section - Logout Button */}
        <div className="p-6">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="w-full bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Menu */}
      <MobileSidebarMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        user={user}
        isAuthenticated={isAuthenticated}
        wallets={wallets}
        loading={loading}
        onRefresh={loadWallets}
        onLogout={logout}
      />
    </>
  );
}