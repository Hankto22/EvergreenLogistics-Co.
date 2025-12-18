"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import whatsappCard from "../../assets/WhatsApp Image 2025-12-05 at 12.15.50 PM.jpeg";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: ""
  });
  const [sent, setSent] = useState(false);

  const contacts = [
    {
      title: "Kenya Office",
      icon: "📍",
      lines: ["Nairobi, Kenya", "Mombasa Road, Industrial Area"]
    },
    {
      title: "China Office",
      icon: "📍",
      lines: ["Guangzhou, China", "Baiyun District"]
    },
    {
      title: "Phone",
      icon: "📞",
      lines: ["Kenya: +254 700 000 000", "China: +86 20 0000 0000"]
    },
    {
      title: "Email",
      icon: "✉️",
      lines: ["info@evergreenlogistics.com", "support@evergreenlogistics.com"]
    }
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const fade = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <>
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for inquiries, quotes, or support</p>
      </section>

      <section className="section">
        <div className="content-shell contact-shell">
          <motion.form
            onSubmit={submit}
            className="contact-card form"
            variants={fade}
            initial="hidden"
            animate="visible"
          >
            <h3>Send us a Message</h3>
            <div className="two-col">
              <div className="field">
                <label>Full Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Company Name</label>
                <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Service Interested In</label>
              <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                <option value="">Select a service</option>
                <option value="ocean">Ocean Freight</option>
                <option value="air">Air Freight</option>
                <option value="road">Road Transportation</option>
                <option value="warehousing">Warehousing</option>
                <option value="customs">Customs Brokerage</option>
              </select>
            </div>
            <div className="field">
              <label>Message *</label>
              <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit">Send Message</button>
            {sent && <p className="success-note">Message sent!</p>}
          </motion.form>

          <motion.div className="contact-card info" variants={fade} initial="hidden" animate="visible">
            <h3>Get in Touch</h3>
            <p className="section-subtitle" style={{ textAlign: "left", marginBottom: 16 }}>
              Have questions? We're here to help. Reach out through any of the following channels.
            </p>
            <div className="info-grid">
              {contacts.map(card => (
                <div key={card.title} className="info-card">
                  <div className="info-icon">{card.icon}</div>
                  <div>
                    <h4>{card.title}</h4>
                    {card.lines.map(line => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="business-hours">
        <div className="content-shell hours-card">
          <div className="info-icon" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>⏰</div>
          <div>
            <h3>Business Hours</h3>
            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </section>

      <section className="locations-section">
        <div className="content-shell locations-shell">
          <div className="map-block">
            <h3 className="section-title" style={{ textAlign: "left", marginBottom: 8 }}>Our Locations</h3>
            <p className="section-subtitle" style={{ textAlign: "left", marginBottom: 16 }}>
              Strategically positioned in Kenya and China
            </p>
            <div className="map-card">
              <iframe
                title="Evergreen Logistics Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63902.61571864638!2d36.7762495!3d-1.2863896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17309f3ef9bf%3A0xafe309866445eb1a!2sIndustrial%20Area%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="whatsapp-card">
            <img src={whatsappCard} alt="WhatsApp contact card" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
