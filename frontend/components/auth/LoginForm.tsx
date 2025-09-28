"use client";
import { useState } from "react";
import { useAuth } from "@/hook/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const { login, loading, error } = useAuth();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      // Redirect happens in the useAuth hook
    } catch (error) {
      // Error is handled in the useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      <Input 
        type="email" 
        placeholder="email@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      
      <Input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-green-700 hover:bg-green-600"
        loading={loading}
        disabled={loading}
      >
        {loading ? "SIGNING IN..." : "SIGN-IN WITH EMAIL"}
      </Button>
    </form>
  );
}
