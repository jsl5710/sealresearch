import React from 'react';
import { motion } from 'framer-motion';
import lab from '../data/lab.json';

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="section-eyebrow text-center">Contact</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-16 leading-tight">
          Get in <span className="italic text-signal">touch</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <p className="mono text-xs uppercase tracking-widest text-signal mb-3">Reach us</p>
            <a href={`mailto:${lab.email}`} className="text-2xl font-serif text-paper hover:text-signal transition-colors block mb-6">
              {lab.email}
            </a>

            <p className="mono text-xs uppercase tracking-widest text-signal mb-3">Visit</p>
            <p className="text-paper mb-1">{lab.department}</p>
            {lab.college && <p className="text-mist mb-1">{lab.college}</p>}
            <p className="text-mist mb-1">{lab.institution}</p>
            <p className="text-mist mb-6">{lab.location}</p>

            <div className="flex flex-wrap gap-3 mt-8">
              {lab.social.twitter && <a href={lab.social.twitter} className="chip hover:bg-signal/20 transition-colors">Twitter/X</a>}
              {lab.social.github && <a href={lab.social.github} className="chip hover:bg-signal/20 transition-colors">GitHub</a>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl overflow-hidden min-h-[300px] relative"
          >
            {/*
              Static, self-hosted map rather than an OpenStreetMap iframe.
              Third-party embeds get blocked by tracking protection and ad
              blockers, and the visitor is shown "This content is blocked"
              where the map should be. An image we serve ourselves cannot
              fail that way, costs no cross-origin request, and tells OSM
              nothing about who visited.

              Attribution is required: the map data is ODbL-licensed.
            */}
            <a
              href="https://www.openstreetmap.org/?mlat=40.0076&mlon=-105.2659#map=15/40.0076/-105.2659"
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full group"
            >
              <img
                src={`${import.meta.env.BASE_URL}campus-map.jpg`}
                alt="Map showing the University of Colorado Boulder main campus, with the lab's location marked."
                loading="lazy"
                className="h-full w-full min-h-[300px] object-cover opacity-90
                           transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="absolute bottom-0 right-0 bg-ink/70 px-2 py-1 text-[10px] text-mist">
                &copy; OpenStreetMap contributors
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
