// components/wallet/ProfSetting.tsx
"use client";

import { useState, useEffect } from "react";
import { Wallet, WalletInput } from "@/lib/types";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Trash2, Settings, Share2, Eye } from "lucide-react";

interface ProfSettingProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<WalletInput>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onShare: (walletId: number, email: string, permission: string) => Promise<void>;
  onViewTransactions: (walletId: number) => void;
}

type TabType = "edit" | "share" | "view";

export function ProfSetting({
  wallet,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onShare,
  onViewTransactions,
}: ProfSettingProps) {
  const [activeTab, setActiveTab] = useState<TabType>("edit");
  const [formData, setFormData] = useState<WalletInput>({
    name: "",
    code: "",
    target: "",
    goal: 0,
  });
  
  // Share form state
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<"read" | "write">("read");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet.name,
        code: wallet.code,
        target: wallet.target,
        goal: wallet.goal,
      });
      setActiveTab("edit");
      setShowDeleteConfirm(false);
      setError("");
      setSuccess("");
    }
  }, [wallet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "goal" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await onSave(wallet.index, formData);
      setSuccess("Wallet updated successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!wallet) return;

    setLoading(true);
    try {
      await onDelete(wallet.index);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await onShare(wallet.index, shareEmail, sharePermission);
      setSuccess("Invitation sent successfully!");
      setShareEmail("");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to share wallet");
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) return null;

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${wallet.name} Settings`}
      maxWidth="max-w-4xl"
    >
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 border-r border-gray-200 pr-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("edit");
              setShowDeleteConfirm(false);
              setError("");
              setSuccess("");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "edit"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Edit Info</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("share");
              setShowDeleteConfirm(false);
              setError("");
              setSuccess("");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "share"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => onViewTransactions(wallet.index)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>View Transactions</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Edit Tab */}
          {activeTab === "edit" && !showDeleteConfirm && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Code
                </label>
                <Input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target
                </label>
                <Input
                  type="text"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Amount ($)
                </label>
                <Input
                  type="number"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Delete Confirmation */}
          {activeTab === "edit" && showDeleteConfirm && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">Delete Wallet?</p>
                <p className="text-red-700 text-sm">
                  This will permanently delete "{wallet.name}" and all its
                  transactions. This action cannot be undone.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Share Tab */}
          {activeTab === "share" && (
            <form onSubmit={handleShareSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                  {success}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Share <span className="font-semibold">{wallet.name}</span> with another user.
                  They will receive an invitation to access this wallet.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <Input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Level
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="permission"
                      value="read"
                      checked={sharePermission === "read"}
                      onChange={(e) => setSharePermission(e.target.value as "read")}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Read Only</p>
                      <p className="text-xs text-gray-600">
                        Can view wallet and transactions
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="permission"
                      value="write"
                      checked={sharePermission === "write"}
                      onChange={(e) => setSharePermission(e.target.value as "write")}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Read & Write</p>
                      <p className="text-xs text-gray-600">
                        Can view and add/edit transactions
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  );
}