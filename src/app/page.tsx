import HeroSlider from "../components/hero/HeroSlider";
import WhyChooseUs from "../components/WhyChooseUs";
import images from "../lib/images";

export default function HomePage() {
  const whyBullets = [
    "Real-time tracking and updates",
    "Competitive pricing and flexible payment options",
    "Expert customs clearance assistance",
    "Secure warehousing in Kenya and China",
    "24/7 customer support"
  ];

  return (
    <>
      <HeroSlider />

      <section className="why-section">
        <div className="why-shell">
          <div className="why-copy">
            <h2 className="why-title">
              Why Choose Evergreen Logistics?
            </h2>
            <p className="why-subtitle">
              We are committed to delivering excellence in every shipment, providing seamless logistics solutions between Kenya and China.
            </p>

            <ul className="why-list">
              {whyBullets.map(item => (
                <li key={item}>
                  <span className="dot" />
                  <span className="why-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="image-frame why-image">
            <img
              src={images.servicesImages.whyChoosePort}
              alt="Port operations"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <WhyChooseUs />
    </>
  );
}
