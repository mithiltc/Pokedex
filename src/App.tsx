import Pokedex from "./assets/pokedex"
import logo from "./components/ui/Pokemon-Logo.jpg"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center gap-100 py-4 px-4">
        <a href="#" className="flex items-start">
          <img
            src={logo}
            alt="Pokédex"
            className="h-30 w-auto object-contain"
          />
        </a>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Pokédex
        </h1>
      </header>
      <Pokedex />
    </div>
  )
}

export default App
