// src/components/HeroCarousel.tsx
import { useEffect, useState } from "react";

const heroImages = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg"
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroImages[index]})` }}
    >
      <div className="hero-overlay">
        <h1>Global Logistics Solutions</h1>
        <p>
          Connecting Kenya to China and the world with reliable shipping services.
        </p>
        <div className="hero-actions">
          <a href="/services" className="btn btn-primary">Our Services →</a>
          <a href="/tracking" className="btn btn-light">Track Shipment</a>
        </div>
        <div className="hero-dots">
          {heroImages.map((_, i) => (
            <span
              key={i}
              className={i === index ? "dot active" : "dot"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;