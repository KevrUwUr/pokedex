import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, Chip } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import InfoIcon from "@mui/icons-material/Info";
import BarChartIcon from "@mui/icons-material/BarChart";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const Pokemon = () => {
  const url = "https://pokeapi.co/api/v2/pokemon";
  const { id } = useParams<{ id: string }>();
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [sprites, setSprites] = useState<{ key: string; value: string }[]>([]);
  const [indexAct, setIndexAct] = useState(7);

  const [page, setPage] = useState(1);
  const movesPerPage = 20;

  const getStatColor = (value: number) => {
    if (value > 100) return "#78C850";
    if (value > 50) return "#F8D030";
    return "#F08030";
  };

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

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{ overflow: "auto" }}
        className="w-100"
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
      className: "text-light",
    };
  }

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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

  const paginatedMoves = pokemonData?.moves.slice(
    (page - 1) * movesPerPage,
    page * movesPerPage
  );

  return (
    <div className="App bg-dark text-light p-3 d-flex w-100 h-100">
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
                  sx={{
                    backgroundColor: colorXType[type.type.name],
                    fontWeight: "bold",
                  }}
                />
              ))}
            </Box>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab
                icon={<InfoIcon />}
                label="Características"
                {...a11yProps(0)}
              />
              <Tab icon={<BarChartIcon />} label="Stats" {...a11yProps(1)} />
              <Tab
                icon={<FitnessCenterIcon />}
                label="Movimientos"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="row g-1">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ color: "text.light"}}>
                    Altura
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FFF",
                      fontWeight: "bold",
                      fontSize: "1.8rem",
                    }}
                  >
                    {pokemonData.height / 10} m
                  </Typography>
                </Box>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6">
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ color: "text.light" }}>
                    Peso
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FFF",
                      fontWeight: "bold",
                      fontSize: "1.8rem",
                    }}
                  >
                    {pokemonData.weight / 10} kg
                  </Typography>
                </Box>
              </div>
              <div className="col-12 p-3">
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "text.light",
                      mb: 1,
                    }}
                  >
                    Habilidades
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {pokemonData.abilities.map((ability, index) => (
                      <Chip
                        key={index}
                        label={ability.ability.name}
                        className="text-capitalize"
                        sx={{
                          backgroundColor: "#FFF",
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </div>
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <ul>
              {pokemonData.stats.map((stat, index) => (
                <div className="row align-items-center">
                  <div className="col">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "text.light" }}
                      className="text-capitalize"
                    >
                      {stat.stat.name}
                    </Typography>
                  </div>
                  <div className="col-8">
                    <LinearProgress
                      key={index}
                      variant="determinate"
                      value={stat.base_stat}
                      sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                          backgroundColor: getStatColor(stat.base_stat),
                        },
                      }}
                    />
                  </div>
                  <div className="col">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "text.light" }}
                    >
                      {stat.base_stat}
                    </Typography>
                  </div>
                </div>
              ))}
            </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div className="d-flex flex-wrap justify-content-center">
              {paginatedMoves?.map((move, index) => (
                <Chip
                  key={index}
                  label={move.move.name}
                  className="m-2"
                  sx={{ backgroundColor: "white", width: "18%" }}
                />
              ))}
              <Pagination
                count={Math.ceil(pokemonData.moves.length / movesPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </div>
          </CustomTabPanel>
        </div>
      ) : (
        <p>Cargando datos del Pokémon...</p>
      )}
    </div>
  );
};

export default Pokemon;
