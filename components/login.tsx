"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { login, signup } from "./actions";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import GoogleButton from "./google";

declare global {
  interface Window {
    handleCallback: any;
  }
}

export default function Login() {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const supabase = CreateClient();
  const Router = useRouter();

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
    window.handleCallback = async (response: any) => {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });
      if (error || !data) {
        console.log(error)
        toast({
          title: "Error",
          description: "There was a problem logging you in",
          variant: "destructive",
        });
      } else {
        setLogged(true);
        toast({
          title: "Login Successful",
          description: "Successfully logged in",
          className: "bg-green-300",
        });
      }
    };
  }, []);

  const validateInput = (): boolean => {
    const maliciousPatterns = /<script|alert|onerror|onload/i;
    if (!email.trim() || maliciousPatterns.test(email)) {
      toast({
        title: "Invalid email",
        description: "Enter a proper value for email",
        variant: "destructive",
      });
      return false;
    }
    let message;
    if (password.length < 6) {
      message = "Length of password cannot be less than 6";
    } else if (maliciousPatterns.test(password)) {
      message = "Bad patterns found in password, enter a safe password!";
    }
    if (message) {
      toast({
        title: "Invalid password",
        description: message,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const signupUser = async () => {
    const protect: boolean = validateInput();
    if (!protect) return;
    let response: string = await signup(email, password);
    if (response === "success") {
      setLogged(true);
      toast({
        title: "Signup successful",
        description: "Signed up successfully! Have fun",
        className: "bg-green-300",
      });
    } else {
      response = response.replaceAll("_", " ");
      toast({
        title: "Signup failed",
        description: response,
        variant: "destructive",
        className: "capitalize",
      });
    }
  };

  const loginUser = async () => {
    const protect: boolean = validateInput();
    if (!protect) return;
    const response: string = await login(email, password);
    if (response === "success") {
      setLogged(true);
      toast({
        title: "Login Successful",
        description: "Logged in successfully",
        className: "bg-green-300",
      });
    } else {
      toast({
        title: "Login failed",
        description: response,
        variant: "destructive",
      });
    }
  };

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setLogged(false);
      Router.push("/");
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
              Sign In
            </span>
          </DialogTrigger>
          <DialogContent className="max-w-sm min-h-sm">
            <script src="https://accounts.google.com/gsi/client" async></script>
            <Tabs defaultValue="signin" className="w-[300px]">
              <TabsList>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <DialogHeader className="mt-4">
                  <DialogTitle>Sign In</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-3 py-6">
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
                </div>
                <GoogleButton action="signin" />
                <Button className="mt-2 w-full" onClick={() => loginUser()}>
                  Log In
                </Button>
              </TabsContent>
              <TabsContent value="signup">
                <DialogHeader className="mt-4">
                  <DialogTitle>Sign Up</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-3 py-6">
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
                </div>
                <GoogleButton action="signup" />
                <Button className="mt-2 w-full" onClick={() => signupUser()}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
