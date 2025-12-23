// components/wallet/AddWalletDialog.tsx
"use client";

import { useState } from "react";
import { WalletInput } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { X, Wallet } from "lucide-react";

interface AddWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: WalletInput) => Promise<void>;
}

export function AddWalletDialog({
  isOpen,
  onClose,
  onCreate,
}: AddWalletDialogProps) {
  const [formData, setFormData] = useState<WalletInput>({
    name: "",
    code: "",
    target: "",
    goal: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "goal" ? parseFloat(value) || 0 : value,
    }));
  };

  const generateCode = () => {
    const code = "W" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData((prev) => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onCreate(formData);
      setFormData({ name: "", code: "", target: "", goal: 0 });
    } catch (err: any) {
      setError(err.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Dialog Box */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Add New Wallet</h2>
              <p className="text-sm text-blue-100">Create a new wallet to track your finances</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Wallet Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wallet Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Emergency Fund, Vacation"
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Wallet Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wallet Code <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Unique code"
                required
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={generateCode}
                className="bg-gray-500 hover:bg-gray-600 px-4"
                disabled={loading}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              A unique identifier for your wallet
            </p>
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Saving Target <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="e.g., New Car, House"
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Goal Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Goal Amount ($) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="10000"
              min="0"
              step="0.01"
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Tip:</span> Set realistic goals and track your progress to achieve financial freedom!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Wallet"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 px-6"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}