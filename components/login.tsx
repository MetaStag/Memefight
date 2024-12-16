"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { login, signup } from "./actions";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

export default function Login() {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const supabase = CreateClient();

  useEffect(() => {
    const checkStatus = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data) {
        setLogged(false);
      } else {
        setLogged(true);
      }
    };
    checkStatus();
  }, []);

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
    const response: number = await signup(email, password);
    let result;
    if (response === 200) {
      result = "Signed up successfully";
      setLogged(true);
    } else {
      result = "Unknown error occured. Make sure to enter valid credentials";
    }
    toast({
      title: "Signup",
      description: result,
    });
  };

  const loginUser = async () => {
    const response: number = await login(email, password);
    let result;
    if (response === 200) {
      result = "Logged in successfully";
      setLogged(true);
    } else {
      result = "Error occured. Check your credentials and try again";
    }
    toast({
      title: "Login",
      description: result,
    });
  };

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setLogged(false);
      redirect("/");
    }
  };

  return (
    <div className="ml-auto">
      {logged ? (
        <Button onClick={logoutUser}>Log Out</Button>
      ) : (
        <Dialog>
          <DialogTrigger>
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
      )}
    </div>
  );
}
