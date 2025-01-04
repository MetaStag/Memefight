"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CreateClient } from "@/lib/utils/supabase/client";
import Caption from "./Caption";
import Vote from "./Vote";
import Results from "./Results";

export default function Play() {
  const [images, setImages] = useState<string[]>([]);
  const [player, setPlayer] = useState(2);
  const [captions, setCaptions] = useState<string[]>([]);
  const [phase, setPhase] = useState(0);
  const [time, setTime] = useState(60);
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
      if (time < 1) {
        setPhase(phase + 1);
        if (phase === 1) () => clearInterval(interval);
        else setTime(30);
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
        setCaptions([data[0].caption1, data[0].caption2]);
      }
    };
    const getGifs = async () => {
      const { data, error } = await supabase
        .from("lobbies")
        .select("url1, url2")
        .eq("code", code);
      if (error || !data[0]) {
        console.log(error);
      } else {
        setImages([data[0].url1, data[0].url2]);
      }
    };
    getCaptions();
    getGifs();
  }, [phase]);

  return (
    <div className="flex flex-col items-center m-12">
      <div className="bg-slate-200 p-2 rounded-lg flex flex-col items-center mb-8">
        <span className="text-xl font-bold mb-4">Time left</span>
        <span className="text-xl">{time} seconds left</span>
      </div>
      {phase === 0 ? (
        <Caption player={player} code={code} />
      ) : (
        <div>
          <div className="flex flex-row gap-x-16">
            <div className="w-64 flex flex-col">
              <Image
                src={images[0] || "null"}
                height={0}
                width={0}
                style={{ width: "100%", height: "100%" }}
                alt="Loading"
                unoptimized
              ></Image>
              <div className="bg-blue-100 p-2 min-w-64 rounded-bl-md rounded-br-md flex flex-col gap-y-4 items-center">
                <span>Caption 1</span>
                <span>{captions[0]}</span>
              </div>
            </div>
            <div className="w-64 flex flex-col">
              <Image
                src={images[1] || "null"}
                height={0}
                width={0}
                style={{ width: "100%", height: "100%" }}
                alt="Loading"
                unoptimized
              ></Image>
              <div className="bg-blue-100 p-2 rounded-bl-md rounded-br-md flex flex-col gap-y-4 items-center">
                <span>Caption 2</span>
                <span>{captions[1]}</span>
              </div>
            </div>
          </div>
          {phase === 1 ? (
            <Vote player={player} code={code} />
          ) : (
            <Results code={code} />
          )}
        </div>
      )}
    </div>
  );
}
