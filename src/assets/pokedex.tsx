import { useEffect, useState } from "react"
import { Menu, Swords } from "lucide-react"
import AutocompleteDemo from "./autocomplete-01"
import PokemonCard, { type Pokemon } from "./card"

type PokemonListResponse = {
  results: Array<{ name: string; url: string }>
}

type PokemonApiResponse = {
  id: number
  name: string
  height: number
  weight: number
  sprites: { other: { [key: string]: { front_default: string | null } } }
  types: Array<{ type: { name: string } }>
}

const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon?limit=1000"
const TYPE_ICON_URL =
  "https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons"

const pokemonTypes = [
  {
    name: "bug",
    description: "Pokémon that resemble insects and other small creatures.",
    strongAgainst: "Grass, Dark, Psychic",
    weakAgainst: "Fire, Flying, Rock",
  },
  {
    name: "dark",
    description:
      "Pokémon associated with shadows, mischief, and clever tactics.",
    strongAgainst: "Ghost, Psychic",
    weakAgainst: "Bug, Fairy, Fighting",
  },
  {
    name: "dragon",
    description:
      "Powerful Pokémon with draconic abilities and ancient strength.",
    strongAgainst: "Dragon",
    weakAgainst: "Dragon, Fairy, Ice",
  },
  {
    name: "electric",
    description: "Pokémon that generate and control electricity.",
    strongAgainst: "Flying, Water",
    weakAgainst: "Ground",
  },
  {
    name: "fairy",
    description: "Magical Pokémon known for charm, light, and mystical power.",
    strongAgainst: "Dark, Dragon, Fighting",
    weakAgainst: "Poison, Steel",
  },
  {
    name: "fighting",
    description:
      "Physical fighters that rely on training, technique, and force.",
    strongAgainst: "Dark, Ice, Normal, Rock, Steel",
    weakAgainst: "Fairy, Flying, Psychic",
  },
  {
    name: "fire",
    description: "Hot-tempered Pokémon that command flames and intense heat.",
    strongAgainst: "Bug, Grass, Ice, Steel",
    weakAgainst: "Ground, Rock, Water",
  },
  {
    name: "flying",
    description: "Aerial Pokémon with speed, wind, and sky-based attacks.",
    strongAgainst: "Bug, Fighting, Grass",
    weakAgainst: "Electric, Ice, Rock",
  },
  {
    name: "ghost",
    description:
      "Ethereal Pokémon that can pass through objects and defy normal rules.",
    strongAgainst: "Ghost, Psychic",
    weakAgainst: "Dark, Ghost",
  },
  {
    name: "grass",
    description:
      "Nature-focused Pokémon connected to plants, forests, and growth.",
    strongAgainst: "Ground, Rock, Water",
    weakAgainst: "Bug, Fire, Flying, Ice, Poison",
  },
  {
    name: "ground",
    description:
      "Earth-powered Pokémon with control over soil, stone, and terrain.",
    strongAgainst: "Electric, Fire, Poison, Rock, Steel",
    weakAgainst: "Grass, Ice, Water",
  },
  {
    name: "ice",
    description:
      "Cold-weather Pokémon that create frost, snow, and freezing attacks.",
    strongAgainst: "Dragon, Flying, Grass, Ground",
    weakAgainst: "Fighting, Fire, Rock, Steel",
  },
  {
    name: "normal",
    description: "Versatile Pokémon with straightforward, dependable moves.",
    strongAgainst: "None",
    weakAgainst: "Fighting",
  },
  {
    name: "poison",
    description:
      "Pokémon that use toxins, fumes, and status effects in battle.",
    strongAgainst: "Fairy, Grass",
    weakAgainst: "Ground, Psychic",
  },
  {
    name: "psychic",
    description: "Mind-powered Pokémon with telekinetic and mental abilities.",
    strongAgainst: "Fighting, Poison",
    weakAgainst: "Bug, Dark, Ghost",
  },
  {
    name: "rock",
    description:
      "Sturdy Pokémon covered in or empowered by stone and minerals.",
    strongAgainst: "Bug, Fire, Flying, Ice",
    weakAgainst: "Fighting, Grass, Ground, Steel, Water",
  },
  {
    name: "steel",
    description: "Armored Pokémon with exceptional defense and metallic power.",
    strongAgainst: "Fairy, Ice, Rock",
    weakAgainst: "Fighting, Fire, Ground",
  },
  {
    name: "water",
    description: "Aquatic Pokémon that manipulate water, currents, and rain.",
    strongAgainst: "Fire, Ground, Rock",
    weakAgainst: "Electric, Grass",
  },
] as const

type BattleResult = {
  player: Pokemon
  opponent: Pokemon
  playerWon: boolean
}

const Pokedex = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isBattleOpen, setIsBattleOpen] = useState(false)
  const [battlePokemonId, setBattlePokemonId] = useState("")
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        const listResponse = await fetch(POKEDEX_URL)
        if (!listResponse.ok) throw new Error("Unable to load the Pokédex.")

        const listData = (await listResponse.json()) as PokemonListResponse
        const details = await Promise.all(
          listData.results.map(async ({ url }) => {
            const response = await fetch(url)
            if (!response.ok) throw new Error("Unable to load Pokémon details.")
            return (await response.json()) as PokemonApiResponse
          })
        )

        setPokemon(
          details.map((item) => ({
            id: item.id,
            name: item.name,
            image:
              item.sprites.other["official-artwork"].front_default ??
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`,
            types: item.types.map(({ type }) => type.name),
            height: item.height,
            weight: item.weight,
          }))
        )
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong while loading the Pokédex."
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadPokemon()
  }, [])

  if (isLoading) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Loading Pokédex...
      </p>
    )
  }

  if (error) {
    return <p className="py-8 text-center text-destructive">{error}</p>
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filteredPokemon = pokemon.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(normalizedSearch)
    const matchesType =
      selectedType === null || item.types.includes(selectedType)
    return matchesSearch && matchesType
  })
  const searchItems = pokemon.map((item) => ({
    id: String(item.id),
    value: item.name,
  }))

  const startBattle = () => {
    const player = pokemon.find((item) => String(item.id) === battlePokemonId)
    if (!player || pokemon.length < 2) return

    const availableOpponents = pokemon.filter((item) => item.id !== player.id)
    const opponent =
      availableOpponents[Math.floor(Math.random() * availableOpponents.length)]

    setBattleResult({
      player,
      opponent,
      playerWon: Math.random() >= 0.5,
    })
  }

  const closeBattle = () => {
    setIsBattleOpen(false)
    setBattleResult(null)
    setBattlePokemonId("")
  }

  return (
    <>
      <AutocompleteDemo
        items={searchItems}
        value={search}
        onValueChange={setSearch}
      />
      {isBattleOpen && (
        <section
          className="mx-auto mt-4 max-w-4xl px-4"
          aria-labelledby="battle-title"
        >
          <div className="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Game session
                </p>
                <h2
                  id="battle-title"
                  className="mt-1 text-xl font-bold text-foreground"
                >
                  Choose your Pokémon
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  The model will choose a random opponent and resolve the
                  battle.
                </p>
              </div>
              <button
                type="button"
                onClick={closeBattle}
                className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Close
              </button>
            </div>

            {!battleResult ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex flex-1 flex-col gap-1 text-sm font-semibold text-foreground">
                  Your Pokémon
                  <select
                    value={battlePokemonId}
                    onChange={(event) => setBattlePokemonId(event.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 font-normal text-foreground capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a Pokémon</option>
                    {pokemon.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={!battlePokemonId}
                  onClick={startBattle}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Swords aria-hidden="true" className="h-4 w-4" />
                  Battle
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="grid gap-4 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      You
                    </p>
                    <p className="mt-1 text-lg font-bold capitalize">
                      {battleResult.player.name}
                    </p>
                  </div>
                  <Swords
                    aria-hidden="true"
                    className="mx-auto h-6 w-6 text-muted-foreground"
                  />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Model
                    </p>
                    <p className="mt-1 text-lg font-bold capitalize">
                      {battleResult.opponent.name}
                    </p>
                  </div>
                </div>
                <p
                  className={`mt-4 text-center text-2xl font-black ${battleResult.playerWon ? "text-green-600" : "text-red-600"}`}
                >
                  {battleResult.playerWon ? "You win!" : "You lose!"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBattleResult(null)
                    setBattlePokemonId("")
                  }}
                  className="mx-auto mt-4 block rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Play again
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-3 px-4 pt-4 lg:grid-cols-[6rem_1fr]">
        <aside className="h-fit overflow-hidden lg:sticky lg:top-4">
          <details>
            <summary
              aria-label={
                selectedType ? `Filter: ${selectedType}` : "Filter by type"
              }
              className="cursor-pointer list-none rounded-lg px-2 py-2 text-center text-xs font-semibold marker:hidden hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Menu aria-hidden="true" className="mx-auto h-5 w-5" />
            </summary>
            <div className="mt-1 grid grid-cols-2 gap-1 lg:grid-cols-1">
              <button
                className={`flex min-h-11 items-center justify-center gap-1 rounded-lg px-1 py-1 text-[11px] font-semibold hover:bg-muted focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${isBattleOpen ? "bg-muted" : ""}`}
                type="button"
                onClick={() => setIsBattleOpen(true)}
              >
                <Swords aria-hidden="true" className="h-4 w-4" />
                Battle
              </button>
              <button
                className="flex min-h-11 items-center justify-center rounded-lg px-1 py-1 text-[11px] font-medium capitalize hover:bg-muted focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                type="button"
                onClick={() => setSelectedType(null)}
              >
                All Pokémon
              </button>
              {pokemonTypes.map((type) => (
                <button
                  key={type.name}
                  aria-pressed={selectedType === type.name}
                  aria-label={`Show ${type.name} Pokémon`}
                  className={`flex min-h-11 min-w-0 items-center justify-center rounded-lg px-1 py-1 hover:bg-muted focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${selectedType === type.name ? "bg-muted" : ""}`}
                  type="button"
                  onClick={() => setSelectedType(type.name)}
                >
                  <img
                    src={`${TYPE_ICON_URL}/${type.name}.svg`}
                    alt=""
                    className="h-7 w-16 max-w-full object-contain drop-shadow-sm"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </details>
        </aside>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPokemon.map((item) => (
            <PokemonCard key={item.id} pokemon={item} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Pokedex
