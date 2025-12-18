"use client";

import { motion } from "framer-motion";
import images from "../../lib/images";
import { IconTarget, IconEye, IconHandshake, IconSettings, IconLeaf } from "../../components/icons/Icons";

// Local WhatsApp image used as a frosted background for the about heading
const frostImg = new URL("../../assets/WhatsApp Image 2025-12-05 at 12.17.15 PM.jpeg", import.meta.url).href;

// Bundled regional manager report (copied into project assets)
const videoSrc = new URL("../../assets/videos/WhatsApp-Regional-Report.mp4", import.meta.url).href;

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

export default function AboutPage() {
  return (
    <section className="py-20 px-6">
      {/* Frosted heading block */}
      <div className="about-heading" style={{ backgroundImage: `url(${frostImg})` }}>
        <div className="about-heading-inner">
          <p className="hero-kicker">Who We Are</p>
          <h1 className="about-heading-title">Evergreen Logistics Co Ltd</h1>
          <p className="about-heading-sub">Connecting Kenya and China with reliable shipping, warehousing, and logistics solutions.</p>
        </div>
      </div>

      <div className="content-shell about-shell">
        <div className="split-section about-split">
          <div className="split-copy-col">
            <p className="hero-kicker">Who We Are</p>
            <h2 className="split-title">Evergreen Logistics Co Ltd</h2>
            <p className="split-copy">
              A leading international freight forwarding company specializing in cargo transportation between Kenya and China.
              With headquarters in Nairobi and strategic warehouses in Guangzhou, we provide end-to-end logistics solutions.
            </p>
            <p className="split-copy">
              Our comprehensive services include ocean freight, air freight, road transportation, warehousing, and customs brokerage.
              We are committed to delivering excellence in every shipment, ensuring your cargo reaches its destination safely and on time.
            </p>
          </div>
          <div className="split-image-col">
            <div className="about-mosaic">
              {images.aboutMosaic.map((src, i) => (
                <div key={i} className="mosaic-cell">
                  <img src={src} alt={`about-${i}`} />
                </div>
              ))}
            </div>
          </div>
          </div>

          {/* Video card: Regional Manager Report (local file holder) */}
          <div className="section" style={{ marginTop: 28 }}>
            <div className="content-shell">
              <div className="video-card">
                <h3 className="section-title">Regional Manager Report</h3>
                <p className="section-subtitle">A short report from our regional operations team.</p>
                <div className="video-wrap">
                  <video controls className="video-player" src={videoSrc}>
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="icon-pill"><IconTarget size={18} /></div>
            <h3>Our Mission</h3>
            <p>
              To provide reliable, efficient, and cost-effective logistics solutions that connect businesses across borders,
              enabling seamless trade between Kenya and China while maintaining the highest standards of service excellence.
            </p>
          </div>
          <div className="mission-card">
            <div className="icon-pill"><IconEye size={18} /></div>
            <h3>Our Vision</h3>
            <p>
              To be the leading logistics partner for businesses in East Africa, recognized for our innovation, reliability,
              and commitment to sustainable growth in international trade and freight forwarding.
            </p>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: "48px" }}>
          <h3 className="section-title">Our Core Values</h3>
          <p className="section-subtitle">
            The principles that guide our operations and relationships
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="service-grid"
        >
          <motion.div
            variants={item}
            className="service-card"
          >
            <div className="icon-pill"><IconHandshake size={18} /></div>
            <h4>Customer First</h4>
            <p>Dedicated to reliable support and transparent communication.</p>
          </motion.div>
          <motion.div
            variants={item}
            className="service-card"
          >
            <div className="icon-pill"><IconSettings size={18} /></div>
            <h4>Operational Excellence</h4>
            <p>Continuous improvement across every step of the supply chain.</p>
          </motion.div>
          <motion.div
            variants={item}
            className="service-card"
          >
            <div className="icon-pill"><IconLeaf size={18} /></div>
            <h4>Sustainability</h4>
            <p>Committed to responsible, future-ready logistics solutions.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
