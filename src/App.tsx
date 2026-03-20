import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './sections/Hero';
import Introduction from './sections/Introduction';
import CascadeSimulation from './sections/CascadeSimulation';
import MathematicalModel from './sections/MathematicalModel';
import ParticleZoo from './sections/ParticleZoo';
import Detection from './sections/Detection';
import Footer from './sections/Footer';
import Navigation from './components/Navigation';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize smooth scroll behavior
    const sections = document.querySelectorAll('.section-reveal');
    
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => section.classList.add('visible'),
        once: true,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#010101]">
      <Navigation />
      <main>
        <Hero />
        <Introduction />
        <CascadeSimulation />
        <MathematicalModel />
        <ParticleZoo />
        <Detection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
