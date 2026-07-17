import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeProvider, useTheme } from './theme/ThemeContext';
import ThemeSwitcher, { AdminKeystrokeListener } from './components/ThemeSwitcher';
import AdminLoginModal from './components/AdminLogin';

import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CursorEffect from './components/CursorEffect';
import ParticleBackground from './components/ParticleBackground';
import Footer from './components/Footer';

import HeroSection from './sections/HeroSection';
import MissionSection from './sections/MissionSection';
import ResearchThemes from './sections/ResearchThemes';
import ProjectsSection from './sections/ProjectsSection';
import PeopleSection from './sections/PeopleSection';
import PublicationsSection from './sections/PublicationsSection';
import CoursesSection from './sections/CoursesSection';
import NewsSection from './sections/NewsSection';
import GrantsSection from './sections/GrantsSection';
import ConferencesSection from './sections/ConferencesSection';
import JoinUsSection from './sections/JoinUsSection';
import HandbookSection from './sections/HandbookSection';
import ContactSection from './sections/ContactSection';

/**
 * Cursor + drifting-node particles are Dark Cinematic signatures.
 * They feel out of place in the light editorial and professional themes,
 * so we suppress them there.
 */
const ThemeConditional = () => {
  const { theme } = useTheme();
  if (theme !== 'dark') return null;
  return (
    <>
      <ParticleBackground />
      <CursorEffect />
    </>
  );
};

function AppInner() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-ink">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <ThemeConditional />
          <ScrollProgress />
          <Navbar />

          <main className="relative z-10">
            <HeroSection />
            <MissionSection />
            <ResearchThemes />
            <ProjectsSection />
            <PeopleSection />
            <PublicationsSection />
            <CoursesSection />
            <NewsSection />
            <GrantsSection />
            <ConferencesSection />
            <JoinUsSection />
            <HandbookSection />
            <ContactSection />
          </main>

          <Footer />
          <ThemeSwitcher />
          <AdminKeystrokeListener />
          <AdminLoginModal />
        </motion.div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
