"use client";

import { useState, useEffect } from "react";
import { CreateClient } from "@/lib/utils/supabase/client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import SvgComponent from "./copyIcon";
import { useToast } from "@/hooks/use-toast";

export default function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  interface Member {
    name: string;
  }
  const [code, setCode] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();
  const supabase = CreateClient();

  useEffect(() => {
    const validate = async () => {
      const temp = (await params).code;
      const { data, error } = await supabase
        .from("lobbies")
        .select("members")
        .eq("code", temp);
      if (error || !data) {
        redirect("/");
      }
      setCode(temp);
      if (data[0]) setMembers(data[0].members);
    };
    validate();
  }, []);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("lobbies")
      .select("members")
      .eq("code", code);
    if (error || !data) {
      return;
    }
    setMembers(data[0].members);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Clipboard",
      description: "Code copied",
    });
  };

  const play = () => {
    // push play to db and trigger update for everyone in lobby
    redirect("/play");
  };

  return (
    <div className="flex flex-col items-center m-4 gap-y-4">
      <span className="text-4xl font-bold">Lobby Waitroom</span>
      <div>
        <span className="bg-slate-400 p-1 inline rounded-lg ">{code}</span>
        <button onClick={() => copyCode()}>
          <SvgComponent className="inline" />
        </button>
      </div>
      <span>
        Share this <span className="underline">invite code</span> and invite
        upto 4 friends!
      </span>
      <div className="bg-blue-100 flex flex-col items-center p-2 rounded-md my-8">
        <span>Members List</span>
        {members ? (
          members.map((member) => <span key={member.name}>{member.name}</span>)
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <Button onClick={refresh}>Refresh member list</Button>
      <Button onClick={() => play()}>Play!</Button>
    </div>
  );
}
