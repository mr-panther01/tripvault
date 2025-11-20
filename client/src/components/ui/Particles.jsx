import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils.js"; // Correct path to utils.js

const PARTICLE_COUNT = 150; // You can increase or decrease this

export const Particles = ({ className }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate initial particles
    const initialParticles = Array.from({ length: PARTICLE_COUNT }, () => ({
      id: Math.random(),
      x: Math.random() * 100, // in vw
      y: Math.random() * 100, // in vh
      size: Math.random() * 2 + 0.5, // size 0.5px to 2.5px
      duration: Math.random() * 5 + 5, // duration 5s to 10s
      delay: Math.random() * -5, // start at different times
    }));
    setParticles(initialParticles);
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden",
        className
      )}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Particles;