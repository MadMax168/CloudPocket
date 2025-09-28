// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api/api";
import { LoginRequest } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.login(formData);
      await login(response.token);
      router.push('/'); // Redirect to main page (wallet dashboard)
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Input 
        type="email" 
        name="email"
        placeholder="email@domain.com"
        value={formData.email}
        onChange={handleInputChange}
        disabled={loading}
      />
      
      <Input 
        type="password" 
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        disabled={loading}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'SIGNING IN...' : 'SIGN-IN WITH EMAIL'}
      </Button>
    </form>
  );
}