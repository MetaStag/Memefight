# Memefight

Platform to compete on who can make the best memes

Create a lobby of upto 5 players. The first 2 players get 60 seconds to make a meme on the spot, they can pick a gif from tenor and have to write a witty caption to complete the gif. The rest 3 users will then vote on which meme is funnier and that player wins

---

### Features
- Login/signup, option for both local and google oauth
- Create/join a lobby based on 5-digit lobby code
- Ability to pick any gif from tenor and submit a caption for the same
- Vote for your favorite meme
- See how many votes each meme got at the end

### Websockets
- When a new person joins the lobby, change is reflected immediately for all existing lobby players
- When lobby leader (the one who made the lobby) starts the game, change is reflected immediately for all lobby players

### Tech Stack
- **Next.Js** - Frontend
- **Shadcn/ui** - Components
- **Supabase** - Backend (as a service) (Database, Auth, Websockets)

### Setup for demo
- Create a supabase project and connect to this app by putting the environment variables in `.env.local`
- Make a `lobbies` table. For maintenance, setup a postgresql cronjob to delete all rows periodically (preferably once per day)
- To setup oauth, make a Google cloud project and copy the client id, and put it in supabase auth integrations
- Deploy on vercel