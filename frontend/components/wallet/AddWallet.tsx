// components/wallet/AddWalletBut.tsx
"use client";

import { useState } from "react";
import { WalletInput } from "@/lib/types";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Wallet, Plus } from "lucide-react";

interface AddWalletButProps {
  onCreate: (data: WalletInput) => Promise<void>;
}

export function AddWalletBut({ onCreate }: AddWalletButProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Wallet
      </Button>

      <Dialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Create New Wallet"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Emergency Fund, Vacation Savings"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Code <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Unique identifier"
                required
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={generateCode}
                className="bg-gray-600 hover:bg-gray-700"
                disabled={loading}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              A unique code to identify your wallet
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saving Target <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="e.g., New Car, House Down Payment"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Amount ($) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g., 10000"
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Tip:</span> Set realistic goals and
              track your progress towards financial freedom!
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            disabled={loading}
          >
            <Wallet className="w-4 h-4" />
            {loading ? "Creating..." : "Create Wallet"}
          </Button>
        </form>
      </Dialog>
    </>
  );
}