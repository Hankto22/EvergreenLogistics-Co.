"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Shipments Delivered" },
  { value: "25+", label: "Countries Served" },
  { value: "15+", label: "Years Experience" },
  { value: "99%", label: "Customer Satisfaction" },
];

const features = [
  {
    title: "Global Shipping",
    description: "Reliable shipping solutions from China to Kenya and across continents.",
  },
  {
    title: "Fast Delivery",
    description: "Expedited air and sea options for time-sensitive shipments.",
  },
  {
    title: "Secure Handling",
    description: "Your cargo is insured and handled with care at every step.",
  },
  {
    title: "Real-time Tracking",
    description: "Track your shipments 24/7 from any device.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="content-shell">
        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="stats-strip"
        >
          {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                className="stat-chip"
              >
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </motion.div>
            ))}
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-head"
        >
          <h2 className="section-title">Why Choose Evergreen</h2>
          <p className="section-subtitle">
            Comprehensive logistics solutions tailored to your needs
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="feature-grid"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="feature-card"
            >
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="cta-section"
        >
          <h3 className="section-title" style={{ color: "#fff", marginBottom: "10px" }}>
            Ready to Ship with Us?
          </h3>
          <p className="section-subtitle" style={{ color: "rgba(255,255,255,0.82)", marginBottom: "18px" }}>
            Get started today and experience seamless logistics services.
          </p>
          <div className="cta-actions">
            <button className="btn btn-ghost">Create Account</button>
            <button className="btn btn-primary">Contact Us</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
