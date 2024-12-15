"use client";

import { redirect } from "next/navigation";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Lobby() {
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const supabase = CreateClient();

  useEffect(() => {
    const protect = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        redirect("/");
      }
    };
    protect();
  }, []);

  const joinlobby = async () => {
    if (!code.trim() || code.length !== 5) {
      toast({
        title: "Invalid code",
        description: "Enter a 5-digit number",
      });
      return;
    }
    const { data, error } = await supabase.from("codes").select();
    if (error || !data) {
      console.log(error); // toast
      return;
    }
    let found: boolean = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].code === code) {
        found = true;
        break;
      }
    }
    if (found) {
      redirect(`/lobby/${code}`);
    } else {
      toast({
        title: "Invalid code",
        description: "Could not find an existing lobby with this code",
      });
    }
  };

  const newlobby = async () => {
    let temp = "";
    for (let i = 0; i < 5; i++) {
      temp += Math.floor(Math.random() * 10);
    }
    setCode(temp);
    const { error } = await supabase
      .from("codes")
      .insert({ code: code, members: [] });
    if (error) {
      toast({
        title: "Error",
        description: "An error occured. Try again later!",
      });
    } else {
      redirect(`/lobby/${temp}`);
    }
  };

  return (
    <div className="flex flex-col justify-center m-4 gap-y-4 max-w-sm ml-auto mr-auto">
      <span className="text-center text-4xl font-bold">Lobby</span>
      <span>Join Lobby</span>
      <input
        className="border-2 p-2 rounded-lg"
        type="text"
        placeholder="Enter lobby code"
        onChange={(e) => setCode(e.target.value)}
      ></input>
      <Button onClick={() => joinlobby()}>Join</Button>
      <span className="text-center">---or---</span>
      <Button onClick={() => newlobby()}>Create New Lobby</Button>
    </div>
  );
}
