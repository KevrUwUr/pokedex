import axios from "axios";
import { useEffect, useState } from "react";
import PokeCard from "../components/pokemonCard";
import "bootstrap/dist/css/bootstrap.min.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Pokedex = () => {
  interface Pokemon {
    name: string;
    id: number;
    image: string;
  }

  const url = "https://pokeapi.co/api/v2/generation/";
  const [generationId, setGenerationId] = useState<string>("1");
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangeGeneration = (event: SelectChangeEvent) => {
    const newGeneration = event.target.value;
    if (newGeneration !== generationId) {
      setGenerationId(newGeneration);
    }
  };

  const getPokemons = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${url}${id}`);
      const results = response.data.pokemon_species;

      const detailedPokemons = await Promise.all(
        results.map(async (pokemon: { name: string }) => {
          try {
            const details = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
            );
            return {
              name: details.data.name,
              id: details.data.id,
              image:
                details.data.sprites.other["official-artwork"].front_default ||
                details.data.sprites.front_default,
            };
          } catch {
            return null;
          }
        })
      );

      setPokemons(
        detailedPokemons
          .filter((p) => p !== null)
          .sort((a, b) => a!.id - b!.id) as Pokemon[]
      );
    } catch (err) {
      console.error("Error al obtener los datos de los Pokémon:", err);
      setError("Error al cargar los Pokémon. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPokemons(generationId);
  }, [generationId]);

  return (
    <div className="App bg-light">
      <div
        className="text-center p-3"
        style={{
          background: "#590209",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          marginBottom: "2rem",
        }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
          alt="PokeAPI Logo"
          style={{ marginBottom: "5px", aspectRatio: "1 / 1" }}
        />
      </div>
      <div className="container p-1">
        <FormControl fullWidth className="mb-1">
          <InputLabel>Generación</InputLabel>
          <Select
            labelId="generation-select-label"
            id="generation-select"
            value={generationId}
            onChange={handleChangeGeneration}
          >
            <MenuItem value="1">Primera generación</MenuItem>
            <MenuItem value="2">Segunda generación</MenuItem>
            <MenuItem value="3">Tercera generación</MenuItem>
            <MenuItem value="4">Cuarta generación</MenuItem>
            <MenuItem value="5">Quinta generación</MenuItem>
            <MenuItem value="6">Sexta generación</MenuItem>
            <MenuItem value="7">Séptima generación</MenuItem>
            <MenuItem value="8">Octava generación</MenuItem>
            <MenuItem value="9">Novena generación</MenuItem>
          </Select>
        </FormControl>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Pokedex;
