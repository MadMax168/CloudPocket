// components/sidebar/UserProf.tsx
"use client";

import { User } from "@/lib/types";
import { Cloud, User as UserIcon } from "lucide-react";

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
    <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-bold text-gray-800">User Data</h2>
        
        {/* Avatar Circle */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl border-4 border-white">
          {isAuthenticated ? (
            <span className="text-3xl font-bold text-white">
              {getInitial()}
            </span>
          ) : (
            <Cloud className="w-10 h-10 text-white" />
          )}
        </div>

        {/* User Info */}
        {isAuthenticated && user ? (
          <div className="text-center w-full">
            <p className="font-bold text-gray-900 text-base mb-1">{user.name}</p>
            <p className="text-sm text-gray-700 truncate px-2">
              {user.email}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-bold text-gray-900 text-base mb-1">Guest</p>
            <p className="text-sm text-gray-700">Please log in</p>
          </div>
        )}
      </div>
    </div>
  );
}