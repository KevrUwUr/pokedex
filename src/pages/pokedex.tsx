import axios from "axios";
import { useEffect, useState } from "react";
import PokeCard from "../components/pokemonCard";
import "bootstrap/dist/css/bootstrap.min.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Pokedex = () => {
  interface Pokemon {
    name: string;
    id: number;
    image: string;
    types: string[];
  }

  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  const generations = [
    { id: 1, range: "1-151" },
    { id: 2, range: "152-251" },
    { id: 3, range: "252-386" },
    { id: 4, range: "387-493" },
    { id: 5, range: "494-649" },
    { id: 6, range: "650-721" },
    { id: 7, range: "722-809" },
    { id: 8, range: "810-905" },
    { id: 9, range: "906-1010" },
  ];

  const urlGeneral = "https://pokeapi.co/api/v2/pokemon?limit=1010";
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const batchRequests = async (
    pokemons: { name: string }[],
    batchSize = 10
  ) => {
    const detailedPokemons: Pokemon[] = [];

    for (let i = 0; i < pokemons.length; i += batchSize) {
      const batch = pokemons.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (pokemon) => {
          try {
            const details = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
            );
            return {
              name: details.data.name,
              id: details.data.id,
              types: details.data.types.map(
                (type: { type: { name: string } }) => type.type.name
              ),
              image:
                details.data.sprites.front_default ||
                details.data.sprites.other["official-artwork"].front_default,
            };
          } catch {
            return null;
          }
        })
      );

      detailedPokemons.push(...batchResults.filter((p) => p !== null));

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return detailedPokemons;
  };

  const getPokemons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${urlGeneral}`);
      const results = response.data.results;

      const detailedPokemons = await batchRequests(results, 10);
      setPokemons(detailedPokemons.sort((a, b) => a.id - b.id));
      setFilteredPokemons(detailedPokemons.sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error("Error al obtener los datos de los Pokémon:", err);
      setError("Error al cargar los Pokémon. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string | null) => {
    const term = searchTerm?.trim() || "";
    if (!term) {
      setFilteredPokemons(pokemons);
      return;
    }

    const lowercasedTerm = term.toLowerCase();
    const searchFiltered = pokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(lowercasedTerm) ||
        pokemon.id.toString().includes(lowercasedTerm)
    );

    setFilteredPokemons(searchFiltered);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    setTypes((prev) =>
      checked ? [...prev, value] : prev.filter((t) => t !== value)
    );
  };

  const handleGenerationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked, value } = event.target;
    const generationId = parseInt(value, 10);

    setSelectedGenerations((prev) =>
      checked
        ? [...prev, generationId]
        : prev.filter((id) => id !== generationId)
    );
  };

  const applyFilters = () => {
    let filtered = [...pokemons];

    // Filtrar por tipos
    if (types.length > 0) {
      filtered = filtered.filter((pokemon) =>
        types.every((type) => pokemon.types.includes(type))
      );
    }

    // Filtrar por generaciones
    if (selectedGenerations.length > 0) {
      filtered = filtered.filter((pokemon) => {
        const gen = selectedGenerations.find((gen: number) => {
          const [start, end] = generations[gen - 1].range
            .split("-")
            .map(Number);
          return pokemon.id >= start && pokemon.id <= end;
        });
        return gen !== undefined;
      });
    }

    setFilteredPokemons(filtered);
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    getPokemons();
  }, []);

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
      <div className="container-fluid ps-5 pe-5">
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
          <TextField
              fullWidth
              className="mb-2"
              id="searchPokemon"
              label="Buscar pokemon"
              placeholder="Introduce el nombre o ID"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Inicio filtros */}

            <Accordion sx={{marginBottom: 2, bgcolor: "transparent" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />} 
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6" gutterBottom className="fw-bold">
                  Filtros
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Tipos</Typography>
                <FormGroup>
                  <div className="flex items-center">
                    {pokemonTypes.map((type) => (
                      <FormControlLabel
                        key={type}
                        className="text-capitalize"
                        sx={{
                          width: "30%",
                          marginBottom: "8px",
                          "& .MuiCheckbox-root": {
                            padding: "8px",
                          },
                          "& .MuiFormControlLabel-label": {
                            fontWeight: 500,
                          },
                        }}
                        id={`type-${type}`}
                        control={
                          <Checkbox value={type} onChange={handleTypeChange} />
                        }
                        label={type}
                        checked={types.includes(type)}
                      />
                    ))}
                  </div>
                </FormGroup>
                <Typography>Generaciones</Typography>

                <FormGroup>
                  <div className="flex flex-wrap">
                    {generations.map((generation) => (
                      <FormControlLabel
                        key={generation.id}
                        className="text-capitalize"
                        sx={{
                          width: "30%",
                          marginBottom: "8px",
                          "& .MuiCheckbox-root": {
                            padding: "8px",
                          },
                          "& .MuiFormControlLabel-label": {
                            fontWeight: 500,
                          },
                        }}
                        id={`generation-${generation.id}`}
                        control={
                          <Checkbox
                            value={generation.id}
                            onChange={handleGenerationChange}
                            checked={selectedGenerations.includes(
                              generation.id
                            )}
                          />
                        }
                        label={`${generation.id} - (${generation.range})`}
                      />
                    ))}
                  </div>
                </FormGroup>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={applyFilters}
              sx={{
                marginTop: 2,
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#3e8e41",
                },
              }}
            >
              Aplicar filtros
            </Button>
              </AccordionDetails>
            </Accordion>

            {/* Fin filtros */}
            <div className="row g-2">
              {filteredPokemons.length > 0 ? (
                filteredPokemons.map((pokemon) => (
                  <div className="col-12 col-md-3 col-lg-3" key={pokemon.id}>
                    <PokeCard
                      name={pokemon.name}
                      number={pokemon.id}
                      image={pokemon.image}
                    />
                  </div>
                ))
              ) : (
                <p>No se encontraron Pokémon.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pokedex;
