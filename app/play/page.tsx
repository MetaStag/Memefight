"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateClient } from "@/lib/utils/supabase/client";
import Caption from "./Caption";
import Vote from "./Vote";
import Results from "./Results";

export default function Play() {
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [player, setPlayer] = useState(2);
  const [caption1, setCaption1] = useState("");
  const [caption2, setCaption2] = useState("");
  const [phase, setPhase] = useState(0);
  const [time, setTime] = useState(30);
  const params = useSearchParams();
  const Router = useRouter();
  const code = params.get("code") || "";
  const name = params.get("name") || "";
  const supabase = CreateClient();

  useEffect(() => {
    const protect = async () => {
      const { data, error } = await supabase
        .from("lobbies")
        .select("code")
        .eq("code", code);
      if (error || !data) {
        console.log(error);
        Router.push("/");
      } else if (data.length === 0) {
        Router.push("/");
      } else {
        const num1 = (Math.ceil(Math.random() * 10) % 5) + 1;
        const num2 = (Math.ceil(Math.random() * 10) % 5) + 1;
        setImage1(`${num1}.png`);
        setImage2(`${num2}.png`);
        const { data, error } = await supabase
          .from("lobbies")
          .select("members")
          .eq("code", code);
        if (error || !data) {
          console.log(error);
        } else {
          if (name === data[0].members[0].name) {
            setPlayer(0);
          } else if (name === data[0].members[1].name) {
            setPlayer(1);
          }
        }
      }
    };
    protect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time < 1 && phase === 1) {
        setPhase(phase + 1);
        () => clearInterval(interval);
      } else if (time < 1) {
        setPhase(phase + 1);
        setTime(30);
      } else {
        setTime(time - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const getCaptions = async () => {
      const { data, error } = await supabase
        .from("lobbies")
        .select("caption1, caption2")
        .eq("code", code);
      if (error || !data[0]) {
        console.log(error);
      } else {
        setCaption1(data[0].caption1);
        setCaption2(data[0].caption2);
      }
    };
    getCaptions();
  }, [phase]);

  return (
    <div className="flex flex-col items-center m-16">
      <div className="flex flex-row gap-x-16">
        <div className="w-100 h-100">
          <img
            src={image1 || "null"}
            height={300}
            width={300}
            alt="Loading"
          ></img>
          <div className="bg-blue-100 p-2 rounded-md flex flex-col gap-y-4 items-center">
            <span>Caption 1</span>
            <span>{caption1}</span>
          </div>
        </div>
        <div className="w-100 h-100">
          <img
            src={image2 || "null"}
            height={300}
            width={300}
            alt="Loading"
          ></img>
          <div className="bg-blue-100 p-2 rounded-md flex flex-col gap-y-4 items-center">
            <span>Caption 2</span>
            <span>{caption2}</span>
          </div>
        </div>
      </div>
      {phase === 0 ? (
        <Caption player={player} code={code} />
      ) : phase === 1 ? (
        <Vote player={player} code={code} />
      ) : (
        <Results code={code} />
      )}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold mt-8 mb-4">Time left</span>
        <span className="text-2xl">{time} seconds left</span>
      </div>
    </div>
  );
}
