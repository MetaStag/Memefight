"use client";

import { useEffect, useState } from "react";
import { CreateClient } from "@/lib/utils/supabase/client";

export default function Results(props: any) {
  interface Result {
    code: string;
    members: [{ name: string }, { name: string }, any, any, any];
    caption1: string;
    caption2: string;
    vote1: number;
    vote2: number;
  }
  const [first, setFirst] = useState({ name: "", votes: 0 });
  const [second, setSecond] = useState({ name: "", votes: 0 });
  const supabase = CreateClient();
  const code = props.code;

  useEffect(() => {
    const getData = async () => {
      let { data, error }: { data: any[] | null; error: any } = await supabase
        .from("lobbies")
        .select()
        .eq("code", code);

      let parsedData: Result;
      if (error || !data) {
        console.log(error);
      } else if (data[0]) {
        parsedData = data[0];
        let name1 = "Unknown";
        let name2 = "Unknown";
        if (parsedData.members && parsedData.members[0]) {
          name1 = parsedData.members[0].name;
        }
        if (parsedData.members && parsedData.members[1]) {
          name2 = parsedData.members[1].name;
        }
        const vote1 = parsedData.vote1 || 0;
        const vote2 = parsedData.vote2 || 0;
        setFirst({ name: name1, votes: vote1 });
        setSecond({ name: name2, votes: vote2 });
      }
    };
    getData();
  }, []);
  return (
    <div className="flex flex-col items-center m-4">
      <span className="text-4xl font-bold">Results</span>
      <span className="bg-blue-100 p-2 m-2 rounded-lg">
        WINNER - {first.name} - {first.votes} votes
      </span>
      <span className="bg-blue-200 p-2 m-2 rounded-lg">
        Second place - {second.name} - {second.votes} votes
      </span>
    </div>
  );
}
