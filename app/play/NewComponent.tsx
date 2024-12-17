"use client";

import { useEffect, useState } from "react";
import { CreateClient } from "@/lib/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewComponent(props: any) {
  const [caption1, setCaption1] = useState("");
  const [caption2, setCaption2] = useState("");
  const [vote, setVote] = useState(0);
  const supabase = CreateClient();
  const Router = useRouter();

  useEffect(() => {
    const getCaptions = async () => {
      const { data, error } = await supabase
        .from("lobbies")
        .select("caption1, caption2")
        .eq("code", props.code);
      if (error || !data[0]) {
        console.log(error);
      } else {
        setCaption1(data[0].caption1);
        setCaption2(data[0].caption2);
      }
    };
    getCaptions();
  }, []);

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
    Router.push(`/results?code=${props.code}`);
  };
  return (
    <div className="flex flex-col m-4 items-center gap-y-8">
      <div className="flex flex-row gap-x-16">
        <div className="bg-blue-100 p-2 rounded-md flex flex-col gap-y-4 items-center">
          <span>Caption 1</span>
          <span>{caption1}</span>
        </div>
        <div className="bg-blue-100 p-2 rounded-md flex flex-col gap-y-4 items-center">
          <span>Caption 2</span>
          <span>{caption2}</span>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 min-w-64 items-center">
        <span className="mt-8 text-xl">Votes</span>
        <span>
          <input type="radio" name="caption" onClick={() => setVote(1)} />
          Caption 1
        </span>
        <span>
          <input type="radio" name="caption" onClick={() => setVote(2)} />
          Caption 2
        </span>
        <Button onClick={handleVoteSubmit}>Submit</Button>
      </div>
    </div>
  );
}
