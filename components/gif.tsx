"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Gif({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifList, setGifList] = useState<string[]>([]);
  const idList = useRef([]);

  const getData = async () => {
    const response = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${process.env.NEXT_PUBLIC_TENOR_API_KEY}&client_key=my_test_app&limit=8`
    );
    if (response.ok) {
      let gifs: string[] = [];
      idList.current = [];
      const data = await response.json();
      console.log(data);
      for (let i = 0; i < 8; i++) {
        idList.current.push(data.results[i].id);
        gifs.push(data.results[i].media_formats.tinygif.url);
      }
      setGifList(gifs);
    } else {
      console.log("Error fetching gif data");
    }
  };

  const handleClick = async (index: number) => {
    const response = await fetch(
      `https://tenor.googleapis.com/v2/registershare?id=${idList.current[index]}&key=${process.env.NEXT_PUBLIC_TENOR_API_KEY}&client_key=my_test_app&q=${searchTerm}`
    );
    onSelect(gifList[index]);
  };

  return (
    <div className="bg-blue-200 flex flex-col p-3 rounded-md gap-y-4 min-w-96">
      <input
        type="text"
        placeholder="Search Tenor"
        className="p-2 rounded-md"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={() => getData()}>Submit</Button>
      <div className="grid grid-cols-2 justify-items-center">
        {gifList.map((item, index) => (
          <Image
            key={index}
            src={item}
            width={0}
            height={0}
            style={{ width: "80%", height: "80%", cursor: "pointer" }}
            alt="tenor gif"
            unoptimized
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      <Image
        src="tenor.svg"
        width={200}
        height={300}
        alt="tenor attribution"
      ></Image>
    </div>
  );
}
