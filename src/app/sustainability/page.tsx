"use client";

import { motion } from "framer-motion";
import { Leaf, Repeat, Award, Target, TrendingDown, Recycle, Users } from "lucide-react";

const goals = [
  {
    title: "30% Carbon Reduction",
    copy: "Reduce carbon emissions across all operations",
    color: "green",
    icon: <Target size={24} />
  },
  {
    title: "80% Recyclable Packaging",
    copy: "Transition to sustainable packaging materials",
    color: "blue",
    icon: <Repeat size={24} />
  },
  {
    title: "ISO 14001 Certification",
    copy: "Achieve environmental management certification",
    color: "orange",
    icon: <Award size={24} />
  }
];

const metrics = [
  { label: "Carbon Emissions", value: "-15%", color: "green", width: "85%" },
  { label: "Renewable Energy Use", value: "+25%", color: "blue", width: "72%" },
  { label: "Waste Recycling Rate", value: "65%", color: "orange", width: "78%" }
];

const initiatives = [
  {
    title: "Carbon Emission Reduction",
    copy: "Implementing fuel-efficient practices and exploring alternative energy sources for our fleet.",
    color: "green",
    icon: <TrendingDown size={22} />
  },
  {
    title: "Sustainable Packaging",
    copy: "Promoting recyclable and biodegradable packaging materials to minimize environmental impact.",
    color: "blue",
    icon: <Recycle size={22} />
  },
  {
    title: "Green Warehousing",
    copy: "Energy-efficient warehouse operations with solar panels and LED lighting systems.",
    color: "mint",
    icon: <Leaf size={22} />
  },
  {
    title: "Community Engagement",
    copy: "Supporting local communities through employment opportunities and social programs.",
    color: "teal",
    icon: <Users size={22} />
  }
];

const framework = [
  {
    title: "Environmental Sustainability",
    items: [
      "ESG Sustainability Committee Organizational Chart",
      "ESG Commitment, Vision, and Strategy",
      "Carbon footprint monitoring and reporting",
      "Renewable energy adoption in facilities"
    ]
  },
  {
    title: "Social Inclusion",
    items: [
      "Equal employment opportunities",
      "Employee training and development programs",
      "Health and safety standards",
      "Community development initiatives"
    ]
  },
  {
    title: "Corporate Governance",
    items: [
      "Human Rights Policy",
      "Sustainable Procurement Policy",
      "Ethical Corporate Management Best Practice Principles",
      "Code of Ethics and Conduct"
    ]
  }
];

export default function SustainabilityPage() {
  const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

  return (
    <>
      <section className="green-hero sustainability-hero">
        <div className="content-shell hero-shell">
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: "rgba(255,255,255,0.08)", display: "inline-grid", placeItems: "center", marginBottom: 16 }}>
              <div className="icon-pill"><Leaf size={28} /></div>
            </div>
            <h1 className="hero-title">Corporate Sustainability</h1>
            <p className="hero-subtitle">Committed to responsible business practices that protect our planet and support communities</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-shell">
          <div className="esg-intro">
            <h2>Our ESG Commitment</h2>
            <p>At Evergreen Logistics, we integrate Environmental, Social, and Governance (ESG) principles into our core business strategy.</p>
          </div>

          <div className="esg-grid">
            {initiatives.map(item => (
              <motion.div
                key={item.title}
                className="esg-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className={`esg-badge ${item.color}`}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section framework-section">
        <div className="content-shell">
          <div className="section-head">
            <h2>Sustainability Framework</h2>
            <p className="section-subtitle">Our comprehensive approach to sustainable operations</p>
          </div>

          <div className="framework-grid">
            {framework.map(group => (
              <motion.div
                key={group.title}
                className="framework-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3>{group.title}</h3>
                <ul className="framework-list">
                  {group.items.map(item => (
                    <li key={item}>
                      <span className="framework-dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="sustainability-cta">
        <div className="content-shell cta-inner">
          <h2>Join Us in Our Sustainability Journey</h2>
          <p>Partner with us for sustainable logistics solutions</p>
        </div>
      </section>

      <section className="section">
        <div className="content-shell">
          <div className="sustainability-top">
            <div className="goals-col">
              <h2 className="goals-title">2025 Sustainability Goals</h2>
              <p className="goals-subtitle">
                We have set ambitious targets to reduce our environmental footprint and enhance our positive social impact by 2025.
              </p>

              <div className="goal-list">
                {goals.map(goal => (
                  <motion.div key={goal.title} className="goal-row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    <div className={`goal-icon ${goal.color}`}>{goal.icon}</div>
                    <div>
                      <h4>{goal.title}</h4>
                      <p>{goal.copy}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div className="report-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <h3>Sustainability Report</h3>
              {metrics.map(metric => (
                <div key={metric.label} className="metric">
                  <div className="metric-header">
                    <span>{metric.label}</span>
                    <span className={`metric-value ${metric.color}`}>{metric.value}</span>
                  </div>
                  <div className="metric-track">
                    <div className={`metric-bar ${metric.color}`} style={{ width: metric.width }} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
