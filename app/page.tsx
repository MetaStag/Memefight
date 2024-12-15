import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-blue-950 text-white flex flex-col items-center">
      <span className="text-4xl mt-16 mb-4">Memefight</span>
      <span className="text-2xl mb-16">A Meme <span className="text-green-400">Competition</span> Platform</span>
      <span className="text-lg">A Platform to let your imagination run free and create memes on the go!</span>
      <span className="text-lg mb-4">Join or Create your lobby, make memes and vote for them!</span>
      <Button className="mb-16">Get Started</Button>
    </div>
  )
}