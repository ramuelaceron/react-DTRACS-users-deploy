// src/components/ParticleBackground/Particle1.jsx
import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Particle1 = React.memo(() => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div className="particle-background1">
      <Particles
        id="tsparticles1"  // ✅ unique ID
        init={particlesInit}
        options={{
          fullScreen: {
            enable: false, // stays inside left container
            zIndex: -1,
          },
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              out_mode: "out",
            },
          },
          interactivity: {
            detect_on: "parent",
            events: {
              onhover: { enable: true, mode: "grab" },
              onclick: { enable: true, mode: "push" }, // ✅ keep spawn effect
              resize: true,
            },
            modes: {
              grab: { distance: 140, line_linked: { opacity: 1 } },
              push: { particles_nb: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          retina_detect: true,
        }}
      />
    </div>
  );
});

export default Particle1;