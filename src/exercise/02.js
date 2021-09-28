// Render as you fetch
// http://localhost:3000/isolated/exercise/02.js

import { useEffect, useState, Suspense } from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary
} from '../pokemon'
import { createResource } from 'utils'

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

const createPokemonResource = pokemonName => createResource(fetchPokemon(pokemonName))

function App() {
  const [pokemonName, setPokemonName] = useState('')
  const [pokemonResource, setPokemonResource] = useState(null)

  useEffect(() => {
    if(!pokemonName) {
      setPokemonResource(null)
      return
    }
    setPokemonResource(createPokemonResource(fetchPokemon(pokemonName)))
  }, [pokemonName])

  const handleReset = () => setPokemonName('')
  const handleSubmit = newPokemonName => setPokemonName(newPokemonName)

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} resetKeys={[pokemonResource]} />
      <hr />
      <div className="pokemon-info">
        {pokemonName ? (
          <PokemonErrorBoundary onSubmit={handleReset}>
            <Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
              <PokemonInfo pokemonResource={pokemonResource} />
            </Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
