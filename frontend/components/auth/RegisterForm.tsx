"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { authApi } from "@/lib/api/api";
import { RegisterRequest } from "@/lib/types";

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.name || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Form submitted');
    console.log('Form data:', formData);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      console.log('Validation error:', validationError);
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authApi.register(registerData);
      console.log('Sending to API:', registerData);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
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

      <Input 
        type="email" 
        name="email"
        placeholder="email@domain.com"
        value={formData.email}
        onChange={handleInputChange}
        disabled={loading}
      />
      
      <Input 
        type="text" 
        name="name"
        placeholder="username"
        value={formData.name}
        onChange={handleInputChange}
        disabled={loading}
      />
      
      <Input 
        type="password" 
        name="password"
        placeholder="Password (min 6 characters)"
        value={formData.password}
        onChange={handleInputChange}
        disabled={loading}
      />
      
      <Input 
        type="password" 
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        disabled={loading}
      />
      
      <hr className="text-zinc-400"/>
      
      <Button 
        type="submit" 
        className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'CREATING ACCOUNT...' : 'SIGN-UP WITH EMAIL'}
      </Button>
    </form>
  );
}