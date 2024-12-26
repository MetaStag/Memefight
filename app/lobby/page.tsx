"use client";

import { useState, useEffect } from "react";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SvgComponent from "./copyIcon";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  interface Member {
    name: string;
  }
  const [code, setCode] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();
  const supabase = CreateClient();
  const Router = useRouter();
  const params = useSearchParams();
  const name = params.get("name");
  const channel = supabase.channel("lobby");
  channel
    .on("broadcast", { event: "play" }, (payload) =>
      handleBroadcast(payload.payload)
    )
    .subscribe();

  useEffect(() => {
    const validate = async () => {
      const temp: string = params.get("code") || "";
      const { data, error } = await supabase
        .from("lobbies")
        .select("members")
        .eq("code", temp);
      if (error || !data) {
        console.log(error);
        Router.push("/");
      } else if (data.length < 1) {
        Router.push("/");
      } else {
        setCode(temp);
        setMembers(data[0].members);
      }
    };
    validate();
  }, []);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("lobbies")
      .select("members")
      .eq("code", code);
    if (error || !data[0]) {
      return;
    }
    setMembers(data[0].members);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Clipboard",
      description: "Code copied",
      className: "bg-green-300",
    });
  };

  const handleBroadcast = (payload: any) => {
    if (payload.message === "1") {
      Router.push(`/play?code=${code}&name=${name}`);
    }
  };

  const play = () => {
    if (members.length < 2) {
      toast({
        title: "Less players",
        description: "Sorry! You need 3-5 players to play this game",
        variant: "destructive",
      });
      return;
    }

    channel.send({
      type: "broadcast",
      event: "play",
      payload: { message: "1" },
    });
    Router.push(`/play?code=${code}&name=${name}`);
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
        Click the invite code above to copy it and invite upto 4 friends!
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
