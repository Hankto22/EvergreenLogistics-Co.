"use client";

import GalleryGrid from "../../components/gallery/GalleryGrid";
import images from "../../lib/images";
import achievements1 from "../../assets/achievements 1.jpeg";
import achievements2 from "../../assets/achievements 2.jpeg";
import achievements from "../../assets/achievements.jpeg";
import project1 from "../../assets/project 1.jpeg";
import project2 from "../../assets/project 2.jpeg";
import project3 from "../../assets/project 3.jpeg";
import project4 from "../../assets/project 4.jpeg";
import project5 from "../../assets/project 5.jpeg";
import project6 from "../../assets/project 6.jpeg";
import project7 from "../../assets/project 7.jpeg";
import project from "../../assets/project.jpeg";
import team from "../../assets/team.jpeg";

const assetImages = [
  achievements1,
  project3,
  project6,
  project,
];

export default function GalleryPage() {
  return (
    <section className="px-6 py-20">
      <div className="content-shell">
        <h1 className="text-4xl font-bold text-center">Community Impact</h1>
        <p className="mt-4 text-center text-gray-600">Supporting children, strengthening education, and empowering communities.</p>
        <p className="mt-4 text-center text-gray-600 max-w-4xl mx-auto">
          Evergreen Logistics Co. Ltd is committed to creating positive social impact through targeted support for children's homes, education initiatives, and community development projects. Our efforts focus on delivering practical assistance that improves lives and builds long-term resilience in the communities we serve.
        </p>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Impact Areas</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Children's Homes</h3>
              <p className="text-sm text-gray-600">Providing shelter, care, and essential resources to support the safety and well-being of vulnerable children.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Orphan Support</h3>
              <p className="text-sm text-gray-600">Partnering with care institutions to improve living conditions and emotional support for orphaned children.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">School Support</h3>
              <p className="text-sm text-gray-600">Enhancing learning environments through classroom furniture, educational materials, and infrastructure support.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Donations</h3>
              <p className="text-sm text-gray-600">Targeted contributions addressing immediate needs such as food, clothing, school supplies, and basic necessities.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Events</h3>
              <p className="text-sm text-gray-600">Community outreach activities involving staff participation and local stakeholder engagement.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Projects</h3>
              <p className="text-sm text-gray-600">Long-term development initiatives designed to strengthen community resilience and self-sufficiency.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Achievements</h3>
              <p className="text-sm text-gray-600">Key milestones and measurable outcomes from our community impact programs.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Team</h3>
              <p className="text-sm text-gray-600">Evergreen Logistics employees actively participating in community service and outreach efforts.</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28, marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12, alignItems: 'center' }}>
            <div>
              <img src={project4} alt="featured" style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 12 }} />
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <img src={images.gallerySamples.orphan?.[0]} alt="thumb1" style={{ width: '100%', height: 156, objectFit: 'cover', borderRadius: 8 }} />
              <img src={images.gallerySamples.school?.[0]} alt="thumb2" style={{ width: '100%', height: 156, objectFit: 'cover', borderRadius: 8 }} />
            </div>
          </div>
        </div>

        {/* Static asset highlights */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Field Highlights</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-6">
            A curated look at our on-the-ground efforts, captured from recent projects, community visits, and team activities.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {assetImages.map((src, idx) => (
              <div key={src} className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <img
                  src={src}
                  alt={`Evergreen gallery asset ${idx + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <GalleryGrid />
      </div>
    </section>
  );
}
