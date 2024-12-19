"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreateClient } from "@/lib/utils/supabase/client";

export default function Page() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const supabase = CreateClient();
  const Router = useRouter();

  const validateName = (): boolean => {
    if (!name.trim()) {
      toast({
        title: "Invalid name",
        description: "Enter a valid name",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const joinlobby = async () => {
    if (!validateName()) return;
    if (!code.trim() || code.match("^[0-9]+$")===null || code.length !== 5) {
      toast({
        title: "Invalid code",
        description: "Enter a 5-digit number",
        variant: "destructive",
      });
      return;
    }
    const { data, error } = await supabase.from("lobbies").select();
    if (error || !data) {
      toast({
        title: "Unknown error",
        description: "An unknown error occured. Try again later",
        variant: "destructive",
      });
      return;
    }
    let id: number = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].code === code) {
        id = i;
        break;
      }
    }
    if (id !== -1) {
      let newMembers = data[id].members;
      if (newMembers.length === 5) {
        toast({
          title: "Lobby full",
          description: "Sorry! The lobby already has 5 people",
          variant: "destructive",
        });
      } else {
        newMembers.push({ name: name });
        const { error } = await supabase
          .from("lobbies")
          .update({ members: newMembers })
          .eq("code", code);
        if (error) {
          console.log(error);
        } else {
          Router.push(`/lobby?code=${code}&name=${name}`);
        }
      }
    } else {
      toast({
        title: "Invalid code",
        description: "Could not find an existing lobby with this code",
        variant: "destructive",
      });
    }
  };

  const newlobby = async () => {
    if (!validateName()) return;
    let temp = "";
    for (let i = 0; i < 5; i++) {
      temp += Math.floor(Math.random() * 10);
    }
    setCode(temp);
    const { error } = await supabase.from("lobbies").insert({
      code: temp,
      members: [{ name: name }],
      caption1: "",
      caption2: "",
      vote1: 0,
      vote2: 0,
    });
    if (error) {
      toast({
        title: "Error",
        description: "An error occured. Try again later!",
        variant: "destructive",
      });
    } else {
      Router.push(`/lobby?code=${temp}&name=${name}`);
    }
  };

  return (
    <div className="flex flex-col justify-center m-4 gap-y-4 max-w-sm ml-auto mr-auto">
      <span className="text-center text-4xl font-bold">Lobby</span>
      <span>Enter your display name:</span>
      <input
        className="border-2 p-2 rounded-lg"
        type="text"
        placeholder="Enter name"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <span>Join Lobby</span>
      <input
        className="border-2 p-2 rounded-lg"
        type="text"
        placeholder="Enter 5-digit number"
        onChange={(e) => setCode(e.target.value)}
      ></input>
      <Button onClick={() => joinlobby()}>Join</Button>
      <span className="text-center">---or---</span>
      <Button onClick={() => newlobby()}>Create New Lobby</Button>
    </div>
  );
}
