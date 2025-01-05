import axios from "axios";
import { useEffect, useState } from "react";
import PokeCard from "../components/pokemonCard";
import "bootstrap/dist/css/bootstrap.min.css";

const Pokedex = () => {
  interface Pokemon {
    name: string;
    id: number;
    image: string;
  }

  const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const getPokemons = async () => {
    try {
      const response = await axios.get(url);
      const results = response.data.results;

      const detailedPokemons = await Promise.all(
        results.map(async (pokemon: { name: string; url: string }) => {
          const pokemonDetails = await axios.get(pokemon.url);
          return {
            name: pokemonDetails.data.name,
            id: pokemonDetails.data.id,
            image: pokemonDetails.data.sprites.front_default,
          };
        })
      );

      setPokemons(detailedPokemons);
    } catch (err) {
      console.error("Error al obtener los datos de los Pokémon:", err);
    }
  };

  useEffect(() => {
    getPokemons();
  }, []);

  return (
    <div className="App bg-dark text-light p-3">
      <div className="container">
        <div className="header">
          <h1 className="text-center">Pokedex</h1>
        </div>
        <div className="row g-2">
          {pokemons.map((pokemon) => (
            <div className="col-12 col-md-3 col-lg-3" key={pokemon.id}>
              <PokeCard
                name={pokemon.name}
                number={pokemon.id}
                image={pokemon.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
