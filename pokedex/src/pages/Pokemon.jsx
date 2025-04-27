import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios"; 

import BackIcon from "../assets/back-to-home.svg";
import LeftArrow from "../assets/chevron_left.svg";
import RightArrow from "../assets/chevron_right.svg";
import WeightIcon from "../assets/weight.svg";
import HeightIcon from "../assets/height.svg";

const Pokemon = () => {
  const { pokemonId } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(undefined);
  const [description, setDescription] = useState("");

  const cleanDescription = (descriptionText) => {
    if (!descriptionText) return ""; 
    let cleaned = descriptionText.replace(/[\n\f\r]/g, " "); 
    cleaned = cleaned.replace(/[^a-zA-Z0-9 .,?!'é-]/g, ''); 
    cleaned = cleaned.replace(/\s+/g, ' ').trim(); 
    cleaned = cleaned.replace(/([.,!?])(?=\w)/g, '$1 '); 
    cleaned = cleaned.replace(/POK[eé]MON/gi, 'Pokémon'); 
    return cleaned;
  };

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
      .then((response) => {
        setPokemon(response.data);
      })
      .catch(() => {
        setPokemon(false);
      });

    axios
      .get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`)
      .then((response) => {
        const englishDescription = response.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        if (englishDescription) {
          const cleanedDescription = cleanDescription(englishDescription.flavor_text);
          setDescription(cleanedDescription);
        }
      })
      .catch(() => {
        setDescription("Description not available.");
      });
  }, [pokemonId]);

  const generatePokemonJSX = (pokemon) => {
    const { name, id, height, weight, types, abilities, stats } = pokemon;
    const fullImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  
    return (
      <div style={{ backgroundColor: "#6AC0FF", minHeight: "100vh", padding: "1rem" }}>
        {/* 👉 Centered container */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
  
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={BackIcon} alt="Back" style={{ cursor: "pointer" }} onClick={() => navigate("/")} />
            <h1 style={{ margin: 0, color: "#fff" }}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
              <span style={{ color: "#333" }}> #{id.toString().padStart(3, "0")}</span>
            </h1>
          </div>
  
          {/* Pokémon Image + Arrows */}
          <div style={{ position: "relative", marginTop: "2rem" }}>
            <img 
              src={LeftArrow} 
              alt="Previous" 
              style={{ position: "absolute", left: "5%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              onClick={() => {
                if (id > 1) {
                  navigate(`/${id - 1}`);
                }
              }}
            />
            <img 
              src={fullImageUrl} 
              alt={name} 
              style={{ 
                width: "100%", 
                maxWidth: "300px", 
                height: "auto", 
                objectFit: "contain",
                margin: "0 auto" 
              }} 
            />
            <img 
              src={RightArrow} 
              alt="Next" 
              style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              onClick={() => {
                navigate(`/${id + 1}`);
              }}
            />
          </div>
  
          {/* Types */}
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
                {typeInfo.type.name}
              </span>
            ))}
          </div>
  
          {/* About Card */}
          <div style={{
            backgroundColor: "#fff",
            margin: "2rem auto",
            width: "90%",
            maxWidth: "500px",
            borderRadius: "16px",
            padding: "1rem",
            minHeight: "300px" // 👉 Added fixed minimum height for better consistency
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
              {/* Move */}
              <div>
                <p style={{ fontWeight: "bold", margin: "0.5rem 0", color: "#333" }}>Move</p>
                <p style={{ color: "#555", margin: "0" }}>{abilities[0]?.ability?.name}</p>
              </div>
            </div>
  
            <p style={{ margin: "1rem", color: "#555" }}>
              {description}
            </p>
          </div>
  
          {/* Base Stats Card */}
          <div style={{
            backgroundColor: "#fff",
            margin: "2rem auto",
            width: "90%",
            maxWidth: "500px",
            borderRadius: "16px",
            padding: "1rem",
            minHeight: "300px" // 👉 Same minHeight for consistency
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
  
        </div> {/* end of centered container */}
      </div>
    );
  };
  

  return (
    <>
      {pokemon === undefined ? (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#333" }}>
          <p>Loading...</p>
        </div>
      ) : pokemon ? (
        generatePokemonJSX(pokemon)
      ) : (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#333" }}>
          <p>Pokemon not found</p>
        </div>
      )}
    </>
  );
};

export default Pokemon;
