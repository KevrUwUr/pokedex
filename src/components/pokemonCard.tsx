import Button from "@mui/material/Button";

interface PokeCardProps {
  name: string;
  number: number;
  image: string;
}

const PokeCard = ({ name, number, image }: PokeCardProps) => {
  const formattedNumber = number.toString().padStart(3, "0");

  return (
    <div
      className="card shadow-sm rounded border-0"
      style={{ maxWidth: "18rem" }}
    >
      <img
        src={image}
        className="card-img-top rounded-top"
        style={{
          aspectRatio: "1/1",
          objectFit: "cover",
          filter: "drop-shadow(5px 5px 13px #111111)",
        }}
        alt={`Imagen de ${name}`}
      />
      <div className="card-body d-flex flex-column justify-content-between">
        <h5
          className="card-title text-center text-uppercase"
          style={{ fontWeight: "bold" }}
        >
          {name}
        </h5>
        <p
          className="card-text text-center"
          style={{ fontSize: "1.2rem", color: "#666" }}
        >
          # {formattedNumber}
        </p>
        <div className="d-flex justify-content-center">
          <a href="/pokemon/{number}" className="w-100">
            <Button variant="contained" className="w-100 bg-dark">
              Ver mas
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PokeCard;
