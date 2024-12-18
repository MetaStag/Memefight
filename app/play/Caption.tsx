"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Caption(props: any) {
  const [caption, setCaption] = useState("");
  const supabase = CreateClient();
  const { toast } = useToast();

  const handleSubmit = async () => {
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
    if (error) {
      console.log(error);
    } else {
      toast({
        title: "Submitted",
        description: "Your caption was submitted!",
      });
    }
  };

  return (
    <div className="flex flex-row m-4 gap-x-16">
      {props.player < 2 ? (
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
      ) : (
        <span className="text-lg m-12">Waiting 30s for players to finish making memes...</span>
      )}
    </div>
  );
}
