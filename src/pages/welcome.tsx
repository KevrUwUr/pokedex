import React from "react";
const Welcome = () => {
  return (
    <div className="App">
      <div className="container d-flex justify-content-center align-items-center">
        <h1>Welcome to PokeWeb!</h1>
        <p>
          This is a simple React application that displays a list of Pokémon.
        </p>
        <p>Click on a Pokémon's name to see more details.</p>
        <p>Powered by Vite and React.</p>
        <a href="https://github.com/kevinfeng7/PokeWeb" target="_blank">
          View the source code on GitHub
        </a>
      </div>
    </div>
  );
};

export default Welcome;
