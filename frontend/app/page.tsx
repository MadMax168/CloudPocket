// app/page.tsx (Updated with Sidebar)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { walletApi, shareApi, transactionApi } from "@/lib/api/api";
import { Wallet, WalletShare, WalletInput } from "@/lib/types";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { WalletProfile } from "@/components/wallet/WalletProfile";
import { ProfSetting } from "@/components/wallet/ProfSetting";
import { Button } from "@/components/ui/Button";
import { Bell } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [sharedWallets, setSharedWallets] = useState<WalletShare[]>([]);
  const [pendingShares, setPendingShares] = useState<WalletShare[]>([]);
  const [walletAmounts, setWalletAmounts] = useState<Record<number, number>>({});
  
  const [loading, setLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading wallet data...');
      
      const [walletsRes, sharedRes, pendingRes] = await Promise.all([
        walletApi.getWallets(),
        shareApi.getSharedWallets(),
        shareApi.getPendingShares(),
      ]);

      console.log('Wallets response:', walletsRes);

      const walletData = walletsRes?.data || [];
      const sharedData = sharedRes || [];
      const pendingData = pendingRes || [];

      setWallets(walletData);
      setSharedWallets(sharedData);
      setPendingShares(pendingData);

      const amounts: Record<number, number> = {};
      
      for (const wallet of walletData) {
        try {
          const transactions = await transactionApi.getTransactions(wallet.index);
          const total = transactions.reduce((sum, t) => {
            return t.type === "income" ? sum + t.amount : sum - t.amount;
          }, 0);
          amounts[wallet.index] = total;
        } catch (err) {
          amounts[wallet.index] = 0;
        }
      }
      
      for (const share of sharedData) {
        try {
          const transactions = await transactionApi.getTransactions(share.Wallet.ID);
          const total = transactions.reduce((sum, t) => {
            return t.type === "income" ? sum + t.amount : sum - t.amount;
          }, 0);
          amounts[share.Wallet.ID] = total;
        } catch (err) {
          amounts[share.Wallet.ID] = 0;
        }
      }
      
      setWalletAmounts(amounts);
    } catch (error) {
      console.error("Failed to load data:", error);
      setWallets([]);
      setSharedWallets([]);
      setPendingShares([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditWallet = async (id: number, data: Partial<WalletInput>) => {
    await walletApi.updateWallet(id, data);
    loadData();
  };

  const handleDeleteWallet = async (id: number) => {
    await walletApi.deleteWallet(id);
    loadData();
  };

  const handleShareWallet = async (walletId: number, email: string, permission: string) => {
    await shareApi.shareWallet(walletId, { email, permission });
  };

  const handleAcceptShare = async (shareId: number) => {
    await shareApi.respondToShare(shareId, "accepted");
    loadData();
  };

  const handleRejectShare = async (shareId: number) => {
    await shareApi.respondToShare(shareId, "rejected");
    loadData();
  };

  const handleOpenSettings = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowSettingsModal(true);
  };

  const handleViewTransactions = (walletId: number) => {
    router.push(`/wallet/${walletId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your wallets and transactions</p>
              </div>
              {pendingShares.length > 0 && (
                <div className="relative">
                  <button className="p-3 hover:bg-gray-100 rounded-lg relative">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingShares.length}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Pending Invitations */}
          {pendingShares.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pending Invitations
              </h2>
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
                {pendingShares.map((share) => (
                  <div
                    key={share.ID}
                    className="px-6 py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {share.Owner.name} shared "{share.Wallet.name}" with you
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Permission: <span className="font-medium capitalize">{share.permission}</span> • {share.Owner.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptShare(share.ID)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleRejectShare(share.ID)}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Wallets */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wallets</h2>
            {wallets.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">You don't have any wallets yet. Create one from the sidebar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet) => (
                  <WalletProfile
                    key={wallet.index}
                    wallet={wallet}
                    currentAmount={walletAmounts[wallet.index] || 0}
                    onSettingsClick={handleOpenSettings}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Shared Wallets */}
          {sharedWallets.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shared With Me
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedWallets.map((share) => (
                  <WalletProfile
                    key={share.ID}
                    wallet={{
                      index: share.Wallet.ID,
                      name: share.Wallet.name,
                      code: share.Wallet.code,
                      target: share.Wallet.target,
                      goal: share.Wallet.goal,
                    }}
                    currentAmount={walletAmounts[share.Wallet.ID] || 0}
                    onSettingsClick={() => {}}
                    isShared={true}
                    sharedBy={share.Owner.name}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <ProfSetting
        wallet={selectedWallet}
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          setSelectedWallet(null);
        }}
        onSave={handleEditWallet}
        onDelete={handleDeleteWallet}
        onShare={handleShareWallet}
        onViewTransactions={handleViewTransactions}
      />
    </div>
  );
}