"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { login, signup } from "./actions";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const validateInput = (nextFunc: string) => {
    const maliciousPatterns = /<script|alert|onerror|onload/i;
    if (!email.trim() || maliciousPatterns.test(email)) {
      toast({
        title: "Invalid email",
        description: "Enter a proper value for email",
      });
      return;
    }
    if (!password.trim() || maliciousPatterns.test(password)) {
      toast({
        title: "Invalid password",
        description: "Enter a proper value for password",
      });
      return;
    }
    if (nextFunc === "login") loginUser();
    else if (nextFunc === "signup") signupUser();
  };

  const signupUser = async () => {
    const result: string = await signup(email, password);
    toast({
      title: "Signup",
      description: result,
    });
  };

  const loginUser = async () => {
    const result: string = await login(email, password);
    toast({
      title: "Login",
      description: result,
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="ml-auto">
        <span className="bg-primary text-primary-foreground shadow hover:bg-primary/90 py-2 px-4 rounded-md">
          Log In
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>
          <DialogDescription>Log In to your user account</DialogDescription>
        </DialogHeader>
        <span>Email</span>
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          placeholder="Enter your email..."
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <span>Password</span>
        <input
          className="border-2 p-2 rounded-lg"
          type="password"
          placeholder="Enter your password..."
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <Button onClick={() => validateInput("login")}>Log In</Button>
        <Button onClick={() => validateInput("signup")}>Sign Up</Button>
      </DialogContent>
    </Dialog>
  );
}
