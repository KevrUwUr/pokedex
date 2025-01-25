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
    navigate(`/pokemon/${number}`);
  };

  return (
    <Card
      sx={{ maxWidth: 345 }}
      onClick={handleNavigate}
      style={{
        background: "transparent",
        backdropFilter: "blur(10px)",
        borderRadius: "8px",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
      }}
      
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image={image}
          style={{
            aspectRatio: "1/1",
            objectFit: "cover",
            filter: "drop-shadow(5px 5px 13px #111111)",
          }}
          alt={`Imagen de ${name}`}
        />
        <CardContent className="d-flex flex-column align-items-center">
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="text-capitalize"
          >
            {name}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            #{formattedNumber}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PokeCard;
