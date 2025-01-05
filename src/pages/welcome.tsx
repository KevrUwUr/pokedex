import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";

const Welcome = () => {
  return (
    <div className="App h-100 d-flex justify-content-center align-items-center bg-dark text-light">
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <h1>Bienvenido a PokeWeb!</h1>
        <p>
          Esta es una aplicacion simple de React que permite visualizar la
          informacion de los pokemon.
        </p>
        <p>Da click al pokemon cuyos detalles desees ver.</p>
        <a href="/Pokedex">
          <Button variant="contained" color="primary">
            Comienza {">"}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Welcome;
