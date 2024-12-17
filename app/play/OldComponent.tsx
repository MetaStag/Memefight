"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function OldComponent(props: any) {
  const [caption, setCaption] = useState("");
  const supabase = CreateClient();
  const { toast } = useToast();

  const handleSubmit = async () => {
    // update caption 2 for second player
    const { error } = await supabase
      .from("lobbies")
      .update({ caption2: caption })
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
      <div className="flex flex-col gap-y-4">
        <span>Enter caption for this image</span>
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          placeholder="Enter caption"
          onChange={(e) => setCaption(e.target.value)}
        ></input>
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </div>
      <div className="flex flex-col gap-y-4">
        <span>Enter caption for this image</span>
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          placeholder="Enter caption"
          onChange={(e) => setCaption(e.target.value)}
        ></input>
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </div>
    </div>
  );
}
