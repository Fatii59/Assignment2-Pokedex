import { Route, Routes } from 'react-router-dom'; 
import './App.css'; 
import Pokedex from './pages/Pokedex'; 
import Pokemon from './pages/Pokemon'; 
function App() {
  return (
    <Routes> 
      {/* Route for the home page, which will display the Pokedex component */}
      <Route path="/" element={<Pokedex />} />
      
      {/* Route for individual Pokémon pages. The ":pokemonId" part captures the Pokémon ID */}
      <Route path="/:pokemonId" element={<Pokemon />} />
    </Routes>
  );
}

export default App; // Exporting the App component so it can be used elsewhere
