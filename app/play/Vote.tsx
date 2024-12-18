"use client";

import { useEffect, useState } from "react";
import { CreateClient } from "@/lib/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function Vote(props: any) {
  const [vote, setVote] = useState(0);
  const supabase = CreateClient();

  const handleVoteSubmit = async () => {
    if (vote === 0) {
      return;
    }
    console.log(vote);
    console.log(props.code);
    let { data }: any = await supabase
      .from("lobbies")
      .select(`vote${vote}`)
      .eq("code", props.code);
    if (vote === 1) data[0].vote1 += 1;
    else if (vote === 2) data[0].vote2 += 1;
    console.log(data[0]);
    const { error } = await supabase
      .from("lobbies")
      .update(data[0])
      .eq("code", props.code);
    if (error) console.log(error);
  };

  return (
    <div className="flex flex-col m-4 items-center gap-y-8">
      {props.player < 2 ? (
        <span className="text-lg m-12">Waiting for players to finish voting...</span>
      ) : (
        <div className="bg-lime-100 rounded-lg py-4 mt-8 flex flex-col gap-y-3 min-w-64 items-center">
          <span className="text-xl">Time for Votes!</span>
          <span>
            <input
              type="radio"
              className="mx-1"
              name="caption"
              onClick={() => setVote(1)}
            />
            Caption 1
          </span>
          <span>
            <input
              type="radio"
              className="mx-1"
              name="caption"
              onClick={() => setVote(2)}
            />
            Caption 2
          </span>
          <Button onClick={handleVoteSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
}
