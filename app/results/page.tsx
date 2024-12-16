"use client";

import { useEffect, useState } from "react";
import { CreateClient } from "@/lib/utils/supabase/client";

export default function Results() {
  const [code, setCode] = useState(29798);
  const [first, setFirst] = useState({name: "", votes: 0});
  const [second, setSecond] = useState({name: "", votes:0});
  const supabase = CreateClient();

  useEffect(() => {
    const getData = async () => {
      let { data, error } = await supabase
        .from("lobbies")
        .select()
        .eq("code", code);
      if (error || !data) {
        console.log(error);
      } else if (data.members[0]) {
        data = data[0];
        setFirst({name: data.members[0].name, votes: data.vote1})
        setSecond({name: data.members[1].name, votes: data.vote2})
      }
    };
    getData();
  }, []);
  return (
    <div className="flex flex-col items-center m-4">
      <span className="text-4xl font-bold">Results</span>
      <span className="bg-blue-100 p-2 m-2 rounded-lg">WINNER - {first.name} - {first.votes} votes</span>
      <span className="bg-blue-200 p-2 m-2 rounded-lg">Second place - {second.name} - {second.votes} votes</span>
    </div>
  );
}
