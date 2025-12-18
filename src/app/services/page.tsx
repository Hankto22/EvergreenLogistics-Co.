"use client";

import { motion } from "framer-motion";
import { IconShip, IconTruck, IconBox, IconGlobe, IconShield } from "../../components/icons/Icons";
import images from "../../lib/images";

const serviceCards = [
  {
    id: "ocean",
    title: "Ocean Freight",
    copy: "Cost-effective sea cargo solutions for large shipments from China to Kenya.",
    bullets: [
      "Full Container Load (FCL)",
      "Less than Container Load (LCL)",
      "Door-to-door delivery",
      "Competitive freight rates",
      "Regular sailing schedules"
    ],
    image: images.servicesImages.ocean,
    icon: <IconShip size={18} />
  },
  {
    id: "air",
    title: "Air Freight",
    copy: "Fast and secure air cargo services for time-sensitive shipments.",
    bullets: [
      "Express delivery options",
      "Airport-to-airport service",
      "Door-to-door delivery",
      "Temperature-controlled shipping",
      "Dangerous goods handling"
    ],
    image: images.servicesImages.air,
    icon: <IconBox size={18} />
  },
  {
    id: "road",
    title: "Road Transportation",
    copy: "Reliable inland transportation and distribution services.",
    bullets: [
      "Nationwide coverage in Kenya",
      "Cross-border transportation",
      "Last-mile delivery",
      "Dedicated trucks available",
      "Real-time GPS tracking"
    ],
    image: images.servicesImages.road,
    icon: <IconTruck size={18} />,
    reverse: true
  },
  {
    id: "warehousing",
    title: "Warehousing & Distribution",
    copy: "Secure storage facilities in Kenya and China with inventory management.",
    bullets: [
      "Modern warehouse facilities",
      "Inventory management systems",
      "Order fulfillment services",
      "Cross-docking capabilities",
      "24/7 security and monitoring"
    ],
    image: images.servicesImages.warehousing,
    icon: <IconBox size={18} />
  },
  {
    id: "customs",
    title: "Customs Brokerage",
    copy: "Expert customs clearance and documentation services.",
    bullets: [
      "Import/export documentation",
      "Duty and tax calculation",
      "Compliance consulting",
      "Fast clearance processing",
      "Regulatory updates"
    ],
    image: images.servicesImages.customs,
    icon: <IconShield size={18} />,
    reverse: true
  },
  {
    id: "purchase",
    title: "Purchase Order Management",
    copy: "End-to-end procurement services from China.",
    bullets: [
      "Supplier sourcing and verification",
      "Quality inspection services",
      "Consolidation services",
      "Payment facilitation",
      "Factory audits"
    ],
    image: images.servicesImages.purchase,
    icon: <IconGlobe size={18} />,
    reverse: true
  }
];

const extras = [
  { title: "International Trade Consulting", copy: "Expert advice on global trade regulations.", icon: <IconGlobe size={18} /> },
  { title: "Cargo Insurance", copy: "Comprehensive coverage for your shipments.", icon: <IconShield size={18} /> },
  { title: "Container Shipping", copy: "FCL and LCL container services.", icon: <IconBox size={18} /> }
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
};

const fadeIn = {
  hidden: { opacity: 0, scale: 1.02 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65 } }
};

export default function ServicesPage() {
  return (
    <>
      <section className="green-hero">
        <div className="content-shell hero-shell">
          <div>
            <p className="hero-kicker" style={{ color: "#d1fae5" }}>Services</p>
            <h1 className="hero-title" style={{ color: "#fff", marginBottom: "12px" }}>Our Solutions</h1>
            <p className="hero-subtitle" style={{ color: "#e8f5ee", maxWidth: "840px" }}>
              Comprehensive logistics services designed to streamline your supply chain from China to Kenya and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-shell services-shell">
          <div className="services-intro">
            <motion.div className="lead" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <h3>End-to-end logistics built for Africa</h3>
              <p>We combine ocean, air and road freight with warehousing and local distribution to deliver goods reliably and on time.</p>
            </motion.div>
            <motion.div className="cta" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <button className="btn btn-primary">Get a Quote</button>
              <button className="btn btn-ghost">Talk to Sales</button>
            </motion.div>
          </div>

          {serviceCards.map((service) => (
            <div key={service.id} id={service.id} className={`split-section ${service.reverse ? "reverse" : ""}`}>
              {!service.reverse && (
                <motion.div className="split-copy-col" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}>
                  <div className="icon-pill">{service.icon}</div>
                  <h2 className="split-title">{service.title}</h2>
                  <p className="split-copy">{service.copy}</p>
                  <ul className="bullet-list">
                    {service.bullets.map(item => (
                      <li key={item}>
                        <span className="bullet-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <motion.div className="image-frame" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}>
                <img src={service.image} alt={service.title} loading="lazy" />
              </motion.div>

              {service.reverse && (
                <motion.div className="split-copy-col" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}>
                  <div className="icon-pill">{service.icon}</div>
                  <h2 className="split-title">{service.title}</h2>
                  <p className="split-copy">{service.copy}</p>
                  <ul className="bullet-list">
                    {service.bullets.map(item => (
                      <li key={item}>
                        <span className="bullet-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          ))}

          <div id="customs" className="section-head" style={{ marginTop: "48px" }}>
            <h3 className="section-title">Additional Services</h3>
            <p className="section-subtitle">Complementary services to support your logistics needs</p>
          </div>

          <div id="extras" className="service-grid">
            {extras.map(card => (
              <motion.div key={card.title} className="service-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                <div className="icon-pill">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="green-hero" style={{ marginTop: 40 }}>
        <div className="content-shell hero-shell" style={{ textAlign: "center" }}>
          <h2 className="hero-title" style={{ color: "#fff", fontSize: "36px", marginBottom: "10px" }}>
            Ready to Get Started?
          </h2>
          <p className="hero-subtitle" style={{ color: "#e8f5ee" }}>
            Contact us today for a customized logistics solution
          </p>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-light">Request a Quote</button>
          </div>
        </div>
      </section>
    </>
  );
}
