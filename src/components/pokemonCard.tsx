import { useNavigate } from "react-router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
interface PokeCardProps {
  name: string;
  number: number;
  image: string;
}
const PokeCard = ({ name, number, image }: PokeCardProps) => {
  const navigate = useNavigate();

  const formattedNumber = number.toString().padStart(3, "0");

  const handleNavigate = () => {
    navigate(`/pokedex/pokemon/${number}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.25)",
        backdropFilter: "blur(12px)",
        p: 2,
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(31, 38, 135, 0.35)",
        },
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image={image}
          sx={{
            width: 96,
            height: 96,
            mx: "auto",
            objectFit: "contain",
            filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))",
          }}
          alt={`Imagen de ${name}`}
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textTransform: "capitalize" }}
          >
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            #{formattedNumber}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
  
};

export default PokeCard;
