"use client";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function RegisterForm() {

  return (
    <form className="space-y-2">
      <Input 
        type="email" 
        name="email"
        placeholder="email@domain.com"
      />
      
      <Input 
        type="text" 
        name="name"
        placeholder="username"
      />
      
      <Input 
        type="password" 
        name="password"
        placeholder="Password"
      />
      
      <Input 
        type="password" 
        name="confirmPassword"
        placeholder="Confirm Password"
      />
      
      <hr className="text-zinc-400"/>
      
      <Button 
        type="submit" 
        className="w-full bg-green-700 hover:bg-green-600"
      >
        SIGN-UP WITH EMAIL
      </Button>
    </form>
  );
}