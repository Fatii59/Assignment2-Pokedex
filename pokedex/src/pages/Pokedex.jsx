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
  Select,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toFirstCharUppercase } from "./constants";

import PokeBall from "../assets/pokeball.svg";
import LeftArrow from "../assets/chevron_left.svg";
import RightArrow from "../assets/chevron_right.svg";

const Pokedex = () => {
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState({});
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("id-asc");
  const limit = 40;

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page * limit}`)
      .then((response) => {
        const { results } = response.data;
        const newPokemonData = {};
        results.forEach((pokemon, index) => {
          const pokemonId = page * limit + index + 1;
          newPokemonData[pokemon.name] = {
            id: pokemonId,
            name: pokemon.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
          };
        });
        setPokemonData(newPokemonData);
      });
  }, [page]);

  const handleSearchChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const getPokemonCard = (pokemon) => {
    const { id, name, sprite } = pokemon;
    return (
      <Card
        key={name}
        sx={{
          cursor: "pointer",
          p: 2,
          textAlign: "center",
          position: "relative",
          "&:hover": { boxShadow: 6 },
          backgroundColor: "#fff",
          borderRadius: "16px",
          maxWidth: "250px",
          width: "100%",
          margin: "0 auto",
        }}
        onClick={() => navigate(`/${name}`)}
      >
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "6px",
            px: 0.5,
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        >
          {`#${id.toString().padStart(3, "0")}`}
        </Typography>
        <CardMedia
          component="img"
          image={sprite}
          alt={name}
          sx={{
            width: "100%",
            maxWidth: "130px",
            height: "auto",
            objectFit: "contain",
            mx: "auto",
          }}
        />
        <CardContent sx={{ paddingBottom: "0 !important" }}>
          <Typography variant="h6">{toFirstCharUppercase(name)}</Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#6AC0FF", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#6AC0FF", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "center", flexWrap: "wrap", gap: 2, py: 2 }}>
          <Box component="img" src={PokeBall} alt="Pokemon Logo" sx={{ height: 50, mr: 2 }} />
          <TextField
            variant="standard"
            onChange={handleSearchChange}
            placeholder="Search Pokémon"
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
              paddingX: 2,
              paddingY: 1,
              borderRadius: 2,
              width: { xs: "80%", sm: 400, md: 500 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Select
            variant="standard"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
              borderRadius: 2,
              minWidth: 150,
              color: "#fff",
            }}
          >
            <MenuItem value="id-asc">Lav-Høj</MenuItem>
            <MenuItem value="id-desc">Høj-Lav</MenuItem>
            <MenuItem value="name-asc">A-Å</MenuItem>
            <MenuItem value="name-desc">Å-A</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>

      {/* Pokémon Grid */}
      {Object.keys(pokemonData).length ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" },
            gap: 2,
            p: { xs: 2, sm: 4 },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Object.values(pokemonData)
            .filter((pokemon) => pokemon.name.includes(filter))
            .sort((a, b) => {
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
            .map((pokemon) => getPokemonCard(pokemon))}
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Pagination Arrows */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 4,
          pb: 4,
        }}
      >
        <img
          src={LeftArrow}
          alt="Previous"
          style={{ cursor: "pointer", width: "40px", height: "40px" }}
          onClick={() => {
            if (page > 0) setPage(page - 1);
          }}
        />
        <img
          src={RightArrow}
          alt="Next"
          style={{ cursor: "pointer", width: "40px", height: "40px" }}
          onClick={() => {
            setPage(page + 1);
          }}
        />
      </Box>
    </Box>
  );
};

export default Pokedex;
