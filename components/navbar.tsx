"use client";

import Link from "next/link";
import Login from "./login";

export default function Navbar() {
  return (
    <div className="bg-blue-950 text-white px-3 py-5 flex flex-row gap-x-6 items-center border-b-2">
      <Link href="/" className="font-bold">
        Memefight
      </Link>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/lobby/create">Lobby</Link>
      <Login action={false}/>
    </div>
  );
}
