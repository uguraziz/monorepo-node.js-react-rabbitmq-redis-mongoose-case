import { Button } from "@/components/ui/button"
import './App.css'

function App() {

  return (
    <>
      <div className="bg-black text-white p-10 text-3xl">
        Tailwind v4 OK 🚀
      </div>

      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </>
  )
}

export default App
