"use client";
import { useState } from "react";
import { useAuth } from "@/hook/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, loading, error } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(formData.name, formData.email, formData.password);
      // Redirect happens in the useAuth hook after auto-login
    } catch (error) {
      // Error is handled in the useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      <Input 
        type="email" 
        name="email"
        placeholder="email@domain.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      
      <Input 
        type="text" 
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      
      <Input 
        type="password" 
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      
      <Input 
        type="password" 
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      
      <hr className="text-zinc-400"/>
      
      <Button 
        type="submit" 
        className="w-full bg-green-700 hover:bg-green-600"
        loading={loading}
        disabled={loading}
      >
        {loading ? "CREATING ACCOUNT..." : "SIGN-UP WITH EMAIL"}
      </Button>
    </form>
  );
}