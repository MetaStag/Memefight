"use client";

import { useEffect, useState } from "react";
import OldComponent from "./OldComponent";
import NewComponent from "./NewComponent";

export default function Play() {
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [vote, setVote] = useState(false);
  const [time, setTime] = useState(5);

  useEffect(() => {
    const num1 = (Math.ceil(Math.random() * 10) % 5) + 1;
    const num2 = (Math.ceil(Math.random() * 10) % 5) + 1;
    setImage1(`${num1}.png`);
    setImage2(`${num2}.png`);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time < 1) {
        setVote(true);
        () => {
          clearInterval(interval);
        };
      } else {
        setTime(time - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

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
        </div>
        <div className="w-100 h-100">
          <img
            src={image2 || "null"}
            height={300}
            width={300}
            alt="Loading"
          ></img>
        </div>
      </div>

      {vote ? (
        <NewComponent code={29798} />
      ) : (
        <div>
          <OldComponent />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold mt-16 mb-4">Time left</span>
            <span className="text-2xl">{time} seconds left</span>
          </div>
        </div>
      )}
    </div>
  );
}
