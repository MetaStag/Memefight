"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Gif from "@/components/gif";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Caption(props: any) {
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const supabase = CreateClient();
  const { toast } = useToast();

  const handleSubmit = async () => {
    console.log(url);
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Choose a gif!",
        variant: "destructive",
      });
      return;
    }
    let updateObj;
    if (props.player === 0) {
      updateObj = { caption1: caption };
    } else if (props.player === 1) {
      updateObj = { caption2: caption };
    }
    const { error } = await supabase
      .from("lobbies")
      .update(updateObj)
      .eq("code", props.code);
    if (error) console.log(error);
    else {
      if (props.player === 0) {
        updateObj = { url1: url };
      } else if (props.player === 1) {
        updateObj = { url2: url };
      }
      await supabase.from("lobbies").update(updateObj).eq("code", props.code);
      toast({
        title: "Submitted",
        description: "Your caption was submitted!",
        className: "bg-green-300",
      });
    }
  };

  return (
    <div>
      {props.player < 2 ? (
        <div className="flex flex-row gap-x-4">
          <Gif onSelect={(url: string) => setUrl(url)} />
          <div className="flex flex-col gap-y-4">
            <span>
              Enter caption for {props.player === 0 ? "first" : "second"} image
            </span>
            <input
              className="border-2 p-2 rounded-lg"
              type="text"
              placeholder="Enter caption"
              onChange={(e) => setCaption(e.target.value)}
            ></input>
            <Button onClick={() => handleSubmit()}>Submit</Button>
          </div>
        </div>
      ) : (
        <span className="text-lg m-12">
          Waiting 30s for players to finish making memes...
        </span>
      )}
    </div>
  );
}
