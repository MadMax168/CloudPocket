// components/sidebar/UserProf.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { User } from "@/lib/types";
import { Cloud } from "lucide-react";

interface UserProfProps {
  user: User | null;
  isAuthenticated: boolean;
}

export function UserProf({ user, isAuthenticated }: UserProfProps) {
  const getInitial = () => {
    if (!user || !user.name) return "";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <Card className="p-4 backdrop-blur-md bg-white/40 border border-white/30 shadow-lg">
      <div className="flex flex-col items-center gap-3">
        {/* Avatar Circle */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          {isAuthenticated ? (
            <span className="text-2xl font-bold text-white">
              {getInitial()}
            </span>
          ) : (
            <Cloud className="w-8 h-8 text-white" />
          )}
        </div>

        {/* User Info */}
        {isAuthenticated && user ? (
          <div className="text-center">
            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
            <p className="text-xs text-gray-600 truncate max-w-[180px]">
              {user.email}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-semibold text-gray-800 text-sm">Guest</p>
            <p className="text-xs text-gray-600">Not logged in</p>
          </div>
        )}
      </div>
    </Card>
  );
}