"use client"

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete"

type AutocompleteItem = { id: string; value: string }

type AutocompleteDemoProps = {
  items: AutocompleteItem[]
  value: string
  onValueChange: (value: string) => void
}

const AutocompleteDemo = ({
  items,
  value,
  onValueChange,
}: AutocompleteDemoProps) => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Autocomplete items={items} value={value} onValueChange={onValueChange}>
        <AutocompleteInput placeholder="Search Pokémon" />
        <AutocompleteContent>
          <AutocompleteEmpty>No Pokémon found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.id} value={item.value}>
                {item.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

export default AutocompleteDemo
