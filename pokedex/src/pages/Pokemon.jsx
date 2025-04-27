import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // React Router hooks for navigation
import axios from "axios"; // Axios to make HTTP requests

// Importing images/icons for UI components
import BackIcon from "../assets/back-to-home.svg";
import LeftArrow from "../assets/chevron_left.svg";
import RightArrow from "../assets/chevron_right.svg";
import WeightIcon from "../assets/weight.svg";
import HeightIcon from "../assets/height.svg";

const Pokemon = () => {
  const { pokemonId } = useParams(); // Extract the pokemonId from the URL params
  const navigate = useNavigate(); // Hook to navigate between routes
  const [pokemon, setPokemon] = useState(undefined); // State to hold pokemon data
  const [description, setDescription] = useState(""); // State for the description of the pokemon

  // Function to clean up the description text by removing unnecessary characters and fixing formatting
  const cleanDescription = (descriptionText) => {
    if (!descriptionText) return ""; 
    
    // Clean up new lines, special characters, extra spaces, and punctuation
    let cleaned = descriptionText.replace(/[\n\f\r]/g, " "); 
    cleaned = cleaned.replace(/[^a-zA-Z0-9 .,?!'é-]/g, ''); 
    cleaned = cleaned.replace(/\s+/g, ' ').trim(); 
    cleaned = cleaned.replace(/([.,!?])(?=\w)/g, '$1 '); 
    cleaned = cleaned.replace(/POK[eé]MON/gi, 'Pokémon'); 
    
    return cleaned;
  };

  // useEffect hook runs when the component is mounted or when pokemonId changes
  useEffect(() => {
    // Fetch Pokémon data from the PokeAPI
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
      .then((response) => {
        setPokemon(response.data); // Store the response data in the state
      })
      .catch(() => {
        setPokemon(false); // If there's an error, set the pokemon state to false
      });

    // Fetch Pokémon species data (for the description)
    axios
      .get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`)
      .then((response) => {
        // Extract the English description from the response
        const englishDescription = response.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        if (englishDescription) {
          const cleanedDescription = cleanDescription(englishDescription.flavor_text); // Clean the description
          setDescription(cleanedDescription); // Set the description state
        }
      })
      .catch(() => {
        setDescription("Description not available."); // In case of error, set default message
      });
  }, [pokemonId]); // Dependency array, re-run effect when pokemonId changes

  // Function to generate JSX structure for displaying Pokemon details
  const generatePokemonJSX = (pokemon) => {
    const { name, id, height, weight, types, abilities, stats } = pokemon;
    const fullImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    return (
      <div style={{ backgroundColor: "#6AC0FF", minHeight: "100vh", padding: "1rem", textAlign: "center" }}>
        {/* Header Section with Back Button and Pokémon Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src={BackIcon} alt="Back" style={{ cursor: "pointer" }} onClick={() => navigate("/")} />
          <h1 style={{ margin: 0, color: "#fff" }}>
            {name.charAt(0).toUpperCase() + name.slice(1)} {/* Capitalize first letter */}
            <span style={{ color: "#333" }}> #{id.toString().padStart(3, "0")}</span> {/* Format the Pokémon ID */}
          </h1>
        </div>

        {/* Pokémon Image Section with Navigation Arrows */}
        <div style={{ position: "relative", marginTop: "2rem" }}>
          {/* Left (Previous) Arrow */}
          <img 
            src={LeftArrow} 
            alt="Previous" 
            style={{ position: "absolute", left: "5%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            onClick={() => {
              if (id > 1) {
                navigate(`/${id - 1}`); // Navigate to previous Pokémon
              }
            }}
          />

          {/* Pokémon Image */}
          <img 
              src={fullImageUrl} 
              alt={name} 
              style={{ 
                width: "100%", 
                maxWidth: "300px", 
                height: "auto", 
                objectFit: "contain" 
              }} 
            />


          {/* Right (Next) Arrow */}
          <img 
            src={RightArrow} 
            alt="Next" 
            style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            onClick={() => {
              navigate(`/${id + 1}`); // Navigate to next Pokémon
            }}
          />
        </div>

        {/* Pokémon Type Section */}
        <div style={{ marginTop: "1rem" }}>
          {types.map((typeInfo) => (
            <span
              key={typeInfo.type.name}
              style={{
                backgroundColor: "#fff",
                color: "#333",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                margin: "0 0.5rem",
                fontWeight: "bold",
                textTransform: "capitalize"
              }}
            >
              {typeInfo.type.name} {/* Display each Pokémon type */}
            </span>
          ))}
        </div>

        {/* About Section (Weight, Height, Abilities) */}
        <div style={{
          backgroundColor: "#fff",
          margin: "2rem auto",
          width: "90%",
          borderRadius: "16px",
          padding: "1rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1rem" }}>
            {/* Weight */}
            <div>
              <img src={WeightIcon} alt="Weight" style={{ width: "24px" }} />
              <p style={{ color: "#333", fontWeight: "bold", margin: "0.5rem 0" }}>{weight / 10} kg</p>
              <p style={{ color: "#777", margin: "0" }}>Weight</p>
            </div>
            {/* Height */}
            <div>
              <img src={HeightIcon} alt="Height" style={{ width: "24px" }} />
              <p style={{ color: "#333", fontWeight: "bold", margin: "0.5rem 0" }}>{height / 10} m</p>
              <p style={{ color: "#777", margin: "0" }}>Height</p>
            </div>
            {/* Ability */}
            <div>
              <p style={{ fontWeight: "bold", margin: "0.5rem 0", color: "#333" }}>Move</p>
              <p style={{ color: "#555", margin: "0" }}>{abilities[0]?.ability?.name}</p>
            </div>
          </div>

          <p style={{ margin: "1rem", color: "#555" }}>
            {description} {/* Display the cleaned description */}
          </p>
        </div>

        {/* Base Stats Section */}
        <div style={{
          backgroundColor: "#fff",
          margin: "2rem auto",
          width: "90%",
          borderRadius: "16px",
          padding: "1rem"
        }}>
          <h2 style={{ color: "#333" }}>Base Stats</h2>
          {stats.map((stat) => (
            <div key={stat.stat.name} style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ textTransform: "uppercase", fontWeight: "bold", color: "#555" }}>{stat.stat.name}</span>
                <span style={{ fontWeight: "bold", color: "#333" }}>{stat.base_stat}</span>
              </div>
              <div style={{ background: "#eee", borderRadius: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    backgroundColor: "#6AC0FF",
                    width: `${(stat.base_stat / 150) * 100}%`,
                    height: "10px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Display loading message or Pokémon details */}
      {pokemon === undefined ? (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#333" }}>
          <p>Loading...</p>
        </div>
      ) : pokemon ? (
        generatePokemonJSX(pokemon) // If Pokémon data exists, generate JSX
      ) : (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#333" }}>
          <p>Pokemon not found</p> {/* Display if Pokémon data is not found */}
        </div>
      )}
    </>
  );
};

export default Pokemon;
