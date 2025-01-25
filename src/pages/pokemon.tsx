import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, Chip } from "@mui/material";

const Pokemon = () => {
  const url = "https://pokeapi.co/api/v2/pokemon";
  const { id } = useParams<{ id: string }>();
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [sprites, setSprites] = useState<{ key: string; value: string }[]>([]);
  const [indexAct, setIndexAct] = useState(7);

  const colorXType: { [key: string]: string } = {
    bug: "#A6B91A",
    dark: "#705746",
    dragon: "#6F35FC",
    electric: "#F8D030",
    fairy: "#F0C8DA",
    fighting: "#C03028",
    fire: "#F08030",
    flying: "#A890F0",
    ghost: "#705898",
    grass: "#78C850",
    ground: "#E0C068",
    ice: "#98D8D8",
    normal: "#A8A878",
    poison: "#A040A0",
    psychic: "#F85888",
    rock: "#B8A038",
    steel: "#B8B8D0",
    water: "#6390F0",
    shadow: "#3E3E3E", 
    unknown: "#68A090",
  };
  


  interface Ability {
    ability: {
      name: string;
      url: string;
    };
  }

  interface Sprite {
    back_default: string;
    front_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_shiny: string;
    front_female: string;
    front_shiny_female: string;
    other: {
      dream_world: {
        front_default: string;
        front_female: string;
      };
      home: {
        front_default: string;
        front_female: string;
        front_shiny: string;
        front_shiny_female: string;
      };
      "official-artwork": {
        front_default: string;
        front_shiny: string;
      };
      showdown: {
        back_default: string;
        back_female: string;
        back_shiny: string;
        back_shiny_female: string;
        front_default: string;
        front_female: string;
        front_shiny: string;
        front_shiny_female: string;
      };
    };
  }

  interface Stat {
    base_stat: number;
    stat: {
      name: string;
    };
  }

  interface Type {
    type: {
      name: string;
    };
  }

  interface Moves {
    move: {
      name: string;
    };
  }

  interface PokemonData {
    id: number;
    name: string;
    height: number;
    weight: number;
    abilities: Ability[];
    types: Type[];
    sprites: Sprite;
    stats: Stat[];
    moves: Moves[];
  }

  const formattedNumber = pokemonData?.id.toString().padStart(3, "0");

  const getPokemonData = async (pokemonId: string) => {
    try {
      const response = await axios.get<PokemonData>(`${url}/${pokemonId}`);
      const data = response.data;
      setPokemonData(data);

      // Procesar sprites
      const newSprites: { key: string; value: string }[] = [];

      // Agregar sprites principales
      Object.entries(data.sprites || {})
        .filter(([_, value]) => typeof value === "string" && value)
        .forEach(([key, value]) => {
          newSprites.push({ key, value: value as string });
        });

      // Agregar sprites de "other"
      Object.entries(data.sprites.other || {}).forEach(
        ([groupKey, groupValue]) => {
          Object.entries(groupValue || {})
            .filter(([_, value]) => typeof value === "string" && value)
            .forEach(([key, value]) => {
              newSprites.push({
                key: `${groupKey}-${key}`,
                value: value as string,
              });
            });
        }
      );

      setSprites(newSprites);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  const ClickCarousel = (movimiento: number) => {
    const newIndex = (indexAct + movimiento + sprites.length) % sprites.length;
    setIndexAct(newIndex);
  };

  useEffect(() => {
    if (id) {
      getPokemonData(id);
    }
  }, [id]);

  return (
    <div className="App bg-dark text-light p-3 d-flex w-100">
      {pokemonData ? (
        <div className="row w-100">
          <div className="carousel-container d-flex align-items-center">
            <button
              className="btn text-light"
              onClick={() => ClickCarousel(-1)}
            >
              &lt;
            </button>
            <div className="carousel-inner d-flex justify-content-center mb-3">
              <img
                src={sprites[indexAct]?.value}
                alt={`${pokemonData.name} - Sprite ${indexAct + 1}`}
                className="img-fluid rounded"
                style={{
                  width: "150px",
                  height: "150px",
                  aspectRatio: "1 / 1",
                }}
              />
            </div>

            <button className="btn text-light" onClick={() => ClickCarousel(1)}>
              &gt;
            </button>
          </div>
          <div className="d-flex flex-column align-items-center">
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              className="text-capitalize"
            >
              {pokemonData.name}
            </Typography>
            <Typography variant="h6" sx={{ color: "text.light" }}>
              #{formattedNumber}
            </Typography>
            <Box className="d-flex flex-wrap justify-content-center">
              {pokemonData.types.map((type, index) => (
                <Chip
                  key={index}
                  label={type.type.name}
                  className="text-capitalize m-2"
                  sx={{backgroundColor: colorXType[type.type.name], fontWeight: "bold" }}
                />
              ))}
            </Box>
          </div>
          <div className="mt-4">
            <p>Altura: {pokemonData.height / 10} m</p>
            <p>Peso: {pokemonData.weight / 10} kg</p>
            <p>Habilidades:</p>
            <ul>
              {pokemonData.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
            <p>Estadísticas:</p>
            <ul>
              {pokemonData.stats.map((stat, index) => (
                <li key={index}>
                  {stat.stat.name}: {stat.base_stat}
                </li>
              ))}
            </ul>
            <p>Movimientos:</p>
            <ul>
              {pokemonData.moves.map((move, index) => (
                <li key={index}>{move.move.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Cargando datos del Pokémon...</p>
      )}
    </div>
  );
};

export default Pokemon;
