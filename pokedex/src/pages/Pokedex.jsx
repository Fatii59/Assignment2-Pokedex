import React, { useEffect, useState } from "react";  
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
} from "@mui/material";  // Material UI components
import { alpha } from "@mui/material/styles";  // Helper to adjust transparency
import SearchIcon from "@mui/icons-material/Search";  // Search icon for the input field
import axios from "axios";  // HTTP client for making API requests
import { useNavigate } from "react-router-dom";  // Hook for navigation
import { toFirstCharUppercase } from "./constants";  // Utility function for capitalization

import PokeBall from "../assets/pokeball.svg";  // Logo
import LeftArrow from "../assets/chevron_left.svg";  // Left arrow icon for pagination
import RightArrow from "../assets/chevron_right.svg";  // Right arrow icon for pagination

// Main Pokedex component
const Pokedex = () => {
  // State hooks
  const navigate = useNavigate();  
  const [pokemonData, setPokemonData] = useState({});  
  const [filter, setFilter] = useState("");  
  const [page, setPage] = useState(0);  
  const [sortOrder, setSortOrder] = useState("id-asc");  
  const limit = 40;  // Number of Pokemon per page set to 40

  // Effect hook to fetch Pokemon data when the page changes
  useEffect(() => {
    // Fetch data from PokeAPI with pagination
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page * limit}`)
      .then((response) => {
        const { results } = response.data;
        const newPokemonData = {};  // Object to hold Pokemon info
        results.forEach((pokemon, index) => {
          const pokemonId = page * limit + index + 1;  // ID calculation based on page and limit
          newPokemonData[pokemonId] = {
            id: pokemonId,
            name: pokemon.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,  // Pokemon sprite URL
          };
        });
        setPokemonData(newPokemonData);  // Update state with fetched data
      });
  }, [page]);  

  // Handle search input change
  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };

  // Function to generate the Pokemon card JSX
  const getPokemonCard = (pokemonId) => {
    const { id, name, sprite } = pokemonData[pokemonId];  // Destructure data for a single Pokemon
    return (
      <Card
        key={id}
        sx={{ 
          cursor: "pointer",  // Make card clickable
          p: 2, 
          textAlign: "center", 
          position: "relative",  // Used for ID positioning
          "&:hover": { boxShadow: 6 }  // Apply shadow on hover
        }}
        onClick={() => navigate(`/${id}`)}  // Navigate to individual Pokemon page on click
      >
        {/* Display Pokemon ID in the top right corner */}
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.7)",  // Background for ID
            borderRadius: "6px",
            px: 0.5,
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        >
          {`#${id.toString().padStart(3, "0")}`}  {/* Format ID to 3 digits */}
        </Typography>
  
        {/* Pokemon sprite */}
        <CardMedia
          component="img"
          image={sprite}
          alt={name}
          sx={{ width: 130, height: 130, mx: "auto" }}  // Center the image
        />
  
        {/* Pokemon name */}
        <CardContent sx={{ paddingBottom: "0 !important" }}>
          <Typography variant="h6">
            {toFirstCharUppercase(name)}  {/* Capitalize first letter of Pokemon name */}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* AppBar (Header) */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
          {/* Pokemon Logo */}
          <Box component="img" src={PokeBall} alt="Pokemon Logo" sx={{ height: 50, mr: 2 }} />

          {/* Search TextField */}
          <TextField
            variant="standard"
            onChange={handleSearchChange}  // Update filter state when user types
            placeholder="Search Pokemon"
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),  // Transparent background
              paddingX: 2,
              paddingY: 1,
              borderRadius: 2,
              width: { xs: "80%", sm: 400, md: 500 },  // Responsive width
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Sort Dropdown */}
          <Select
            variant="standard"
            value={sortOrder}  // Current sort order
            onChange={(e) => setSortOrder(e.target.value)}  // Update sort order
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
              borderRadius: 1,
              minWidth: 150,
            }}
          >
            <MenuItem value="id-asc">Lav-Høj</MenuItem>
            <MenuItem value="id-desc">Høj-Lav</MenuItem>
            <MenuItem value="name-asc">A-Å</MenuItem>
            <MenuItem value="name-desc">Å-A</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>

      {/* Pokemon Cards */}
      {Object.keys(pokemonData).length ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
            p: 4,
          }}
        >
          {Object.values(pokemonData)
            .filter((pokemon) => pokemon.name.includes(filter.toLowerCase()))  // Apply search filter
            .sort((a, b) => {
              // Sorting logic based on selected sortOrder
              switch (sortOrder) {
                case "id-asc":
                  return a.id - b.id;
                case "id-desc":
                  return b.id - a.id;
                case "name-asc":
                  return a.name.localeCompare(b.name);
                case "name-desc":
                  return b.name.localeCompare(a.name);
                default:
                  return 0;
              }
            })
            .map((pokemon) => getPokemonCard(pokemon.id))  // Generate cards for each Pokemon
          }
        </Box>
      ) : (
        // Loading spinner while data is being fetched
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Pagination (Arrow buttons) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 4,  // Margin top for spacing
          pb: 4,  // Padding bottom for spacing
        }}
      >
        {/* Left Arrow (Previous Page) */}
        <img
          src={LeftArrow}
          alt="Previous"
          style={{ cursor: "pointer", width: "40px", height: "40px" }}
          onClick={() => {
            if (page > 0) setPage(page - 1);  // Decrease page number (if not at the first page)
          }}
        />

        {/* Right Arrow (Next Page) */}
        <img
          src={RightArrow}
          alt="Next"
          style={{ cursor: "pointer", width: "40px", height: "40px" }}
          onClick={() => {
            setPage(page + 1);  // Increase page number
          }}
        />
      </Box>
    </>
  );
};

export default Pokedex;
