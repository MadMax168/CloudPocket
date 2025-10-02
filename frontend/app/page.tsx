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
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
      
      </div>
    </div>
  );
}