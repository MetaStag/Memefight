"use client";

import { Button } from "@/components/ui/button";
import { CreateClient } from "@/lib/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const supabase = CreateClient();
  const Router = useRouter();
  const { toast } = useToast();

  const start = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      toast({
        title: "Sign In first",
        description: "Click on the Sign In button in Navbar",
      });
    } else {
      Router.push("/lobby/create");
    }
  };

  return (
    <div className="bg-blue-950 text-white flex flex-col items-center">
      <span className="text-4xl mt-16 mb-4">Memefight</span>
      <span className="text-2xl mb-16">
        A Meme <span className="text-green-400">Competition</span> Game
      </span>
      <span className="text-lg">
        A Game to let your imagination run free and create memes on the go!
      </span>
      <span className="text-lg mb-4">
        Join or Create your lobby, make memes and vote for them!
      </span>
      <Button onClick={() => start()} className="mb-16 w-32 h-11 text-md">
        Get Started
      </Button>
    </div>
  );
}
