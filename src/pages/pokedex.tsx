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
            image:
              pokemonDetails.data.sprites.front_default ||
              pokemonDetails.data.sprites.other?.["official-artwork"]
                ?.front_default,
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
    <div className="App bg-light">
      <div
        className="text-center p-3"
        style={{
          background: " #590209",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          marginBottom: "2rem",
        }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
          alt="PokeAPI Logo"
          style={{ marginBottom: "5px", aspectRatio: 1 / 1 }}
        />
      </div>
      <div className="container">
        {/* Cards de Pokémon */}
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
