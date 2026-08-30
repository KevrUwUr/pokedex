import { useEffect, useMemo, useState } from "react";
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
import { useGetPokemonPageWithDetailsQuery } from "../services/pokemon.service";

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

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);

  const pageSize = 30;
  const offset = (page - 1) * pageSize;
  const totalPages = 34;
  const hasMorePages = page < totalPages;

  const {
    data: pagePokemons = [],
    isLoading: loading,
    isFetching,
    error,
  } = useGetPokemonPageWithDetailsQuery({ limit: pageSize, offset });

  useEffect(() => {
    if (!pagePokemons.length) return;

    setAllPokemons((prev) => {
      const existingIds = new Set(prev.map((pokemon) => pokemon.id));
      const newPokemons = pagePokemons.filter(
        (pokemon) => !existingIds.has(pokemon.id)
      );

      return page === 1 ? pagePokemons : [...prev, ...newPokemons];
    });
  }, [pagePokemons, page]);

  const filteredPokemons = useMemo(() => {
    let result = [...allPokemons];

    const term = searchTerm?.trim().toLowerCase() ?? "";
    if (term) {
      result = result.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(term) ||
          pokemon.id.toString().includes(term)
      );
    }

    if (types.length > 0) {
      result = result.filter((pokemon) =>
        types.every((type) => pokemon.types.includes(type))
      );
    }

    if (selectedGenerations.length > 0) {
      result = result.filter((pokemon) =>
        selectedGenerations.some((generationId) => {
          const generation = generations[generationId - 1];
          if (!generation) return false;
          const [start, end] = generation.range.split("-").map(Number);
          return pokemon.id >= start && pokemon.id <= end;
        })
      );
    }

    return result;
  }, [allPokemons, searchTerm, types, selectedGenerations]);

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

  useEffect(() => {
    setPage(1);
  }, [searchTerm, types, selectedGenerations]);

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
              </AccordionDetails>
            </Accordion>


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
            <div className="d-flex justify-content-center mt-4 mb-3">
              {hasMorePages && (
                <Button
                  variant="contained"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={isFetching}
                  sx={{
                    borderRadius: "999px",
                    px: 4,
                    py: 1.2,
                    fontWeight: 700,
                    backgroundColor: "#590209",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#7a0f18",
                    },
                  }}
                >
                  {isFetching ? "Cargando..." : "Ver más"}
                </Button>
              )}
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pokedex;
