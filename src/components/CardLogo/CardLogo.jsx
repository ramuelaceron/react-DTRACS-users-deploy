import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // 👈 import useNavigate
import "./CardLogo.css";
import BlueLogo from "../../assets/images/sgod-blue.png";
import WhiteLogo from "../../assets/images/sgod-white.png";

const CardLogo = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="card"
      style={{ backgroundImage: `url(${hovered ? WhiteLogo : BlueLogo})` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("/SGOD")}   // 👈 navigate when clicked
    >
      <div className={`card-text ${hovered ? "hovered" : ""}`}>
        <h1 className="title">
          School Governance and <br /> Operations Division
        </h1>
      </div>
    </div>
  );
};

export default CardLogo;
