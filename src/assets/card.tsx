import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
export type Pokemon = {
  id: number
  name: string
  image: string
  types: string[]
  height: number
  weight: number
}

type PokemonCardProps = {
  pokemon: Pokemon
}

export const typeColors: Record<string, string> = {
  bug: "border-lime-600 bg-lime-500 text-white hover:bg-lime-600",
  dark: "border-slate-700 bg-slate-600 text-white hover:bg-slate-700",
  dragon: "border-indigo-600 bg-indigo-500 text-white hover:bg-indigo-600",
  electric: "border-yellow-500 bg-yellow-400 text-black hover:bg-yellow-500",
  fairy: "border-pink-500 bg-pink-400 text-white hover:bg-pink-500",
  fighting: "border-orange-700 bg-orange-600 text-white hover:bg-orange-700",
  fire: "border-red-600 bg-red-500 text-white hover:bg-red-600",
  flying: "border-sky-500 bg-sky-400 text-white hover:bg-sky-500",
  ghost: "border-violet-700 bg-violet-600 text-white hover:bg-violet-700",
  grass: "border-green-600 bg-green-500 text-white hover:bg-green-600",
  ground: "border-amber-700 bg-amber-600 text-white hover:bg-amber-700",
  ice: "border-cyan-500 bg-cyan-400 text-white hover:bg-cyan-500",
  normal: "border-stone-500 bg-stone-400 text-white hover:bg-stone-500",
  poison: "border-purple-600 bg-purple-500 text-white hover:bg-purple-600",
  psychic: "border-fuchsia-600 bg-fuchsia-500 text-white hover:bg-fuchsia-600",
  rock: "border-stone-700 bg-stone-600 text-white hover:bg-stone-700",
  steel: "border-slate-500 bg-slate-400 text-white hover:bg-slate-500",
  water: "border-blue-600 bg-blue-500 text-white hover:bg-blue-600",
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="px-0">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="aspect-square w-full bg-muted object-contain p-6"
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="capitalize">
          {String(pokemon.id).padStart(3, "0")} {pokemon.name}
        </CardTitle>
        <div className="flex gap-3">
          {pokemon.types.slice(0, 2).map((type) => (
            <Badge
              key={type}
              variant="default"
              className={`min-w-20 px-4 ${typeColors[type.toLowerCase()] ?? "bg-muted"}`}
            >
              <span className="text-sm font-bold capitalize">{type}</span>
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Height: {pokemon.height / 10} m
          <br />
          Weight: {pokemon.weight / 10} kg
        </p>
      </CardHeader>
    </Card>
  )
}

export default PokemonCard
