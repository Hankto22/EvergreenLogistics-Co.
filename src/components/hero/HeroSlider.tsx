"use client";

import { useEffect, useState, useRef } from "react";
import images from "../../lib/images";

export default function HeroSlider() {
  const slides = images.heroImages.map((i) => i.src);
  const [index, setIndex] = useState(0);
  const hoverRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!hoverRef.current) setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section
      className="hero-banner hero-slider"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {slides.map((src, i) => (
        <div
          key={src}
          className={`hero-slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden={i === index ? "false" : "true"}
        />
      ))}

      <div className="hero-content">
        <div className="hero-copy">
          <p className="hero-kicker">LOGISTICS • EAST AFRICA</p>
          <h1 className="hero-title">Evergreen Logistics — Reliable Supply Chain Solutions</h1>
          <p className="hero-subtitle">
            Freight forwarding, warehousing and end-to-end logistics between China and East Africa — built for speed and reliability.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary">Track Your Shipment</button>
            <button className="btn hero-btn-alt">Get a Quote</button>
          </div>
        </div>
      </div>

      <div className="hero-controls">
        <button aria-label="Previous slide" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)} className="icon-btn">◀</button>
        <div className="hero-dots" role="tablist" aria-label="Hero slides">
          {slides.map((_, i) => (
            <button key={i} className={`hero-dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-selected={i === index} />
          ))}
        </div>
        <button aria-label="Next slide" onClick={() => setIndex((i) => (i + 1) % slides.length)} className="icon-btn">▶</button>
      </div>
    </section>
  );
}
