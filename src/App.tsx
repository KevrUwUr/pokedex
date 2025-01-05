import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
import Pokedex from "./pages/pokedex";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/Pokedex" element={<Pokedex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
