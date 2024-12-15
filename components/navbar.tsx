import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-zinc-300 p-3 flex flex-row gap-x-6 items-center border-b-2">
      <Link href="/" className="font-bold">
        Memefight
      </Link>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/fight">Fight</Link>
      <Button className="ml-auto">Log In</Button>
    </div>
  );
}
