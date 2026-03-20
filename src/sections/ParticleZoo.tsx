import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Atom, Zap, Wind, Circle, Ghost } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  id: string;
  name: string;
  symbol: string;
  role: string;
  mass: string;
  lifetime: string;
  charge: string;
  description: string;
  color: string;
  icon: React.ElementType;
  properties: { label: string; value: string }[];
}

const particles: Particle[] = [
  {
    id: 'proton',
    name: 'Proton',
    symbol: 'p / p⁺',
    role: 'The Initiator',
    mass: '938.27 MeV/c²',
    lifetime: '> 2.1 × 10²⁹ years',
    charge: '+1e',
    description: 'The primary component of cosmic rays. When a high-energy proton enters the atmosphere, it collides with air nuclei, initiating the hadronic cascade that produces pions and other secondary particles.',
    color: '#ff6b6b',
    icon: Atom,
    properties: [
      { label: 'Type', value: 'Baryon (uud)' },
      { label: 'Spin', value: '1/2' },
      { label: 'Interaction', value: 'Strong, EM, Weak' },
    ],
  },
  {
    id: 'pion',
    name: 'Pion',
    symbol: 'π⁺ / π⁻ / π⁰',
    role: 'The Messenger',
    mass: '139.6 MeV/c² (charged)',
    lifetime: '26 ns (charged), 8.4×10⁻¹⁷s (neutral)',
    charge: '±1e, 0',
    description: 'The workhorse of hadronic showers. Charged pions decay to muons, while neutral pions decay almost instantly to photons, seeding the electromagnetic cascade.',
    color: '#feca57',
    icon: Zap,
    properties: [
      { label: 'Type', value: 'Meson (ūd, dū, (uū-dđ)/√2)' },
      { label: 'Spin', value: '0' },
      { label: 'Decay', value: 'π± → μ± + ν, π⁰ → γγ' },
    ],
  },
  {
    id: 'muon',
    name: 'Muon',
    symbol: 'μ⁺ / μ⁻',
    role: 'The Penetrator',
    mass: '105.7 MeV/c²',
    lifetime: '2.2 μs (rest frame)',
    charge: '±1e',
    description: 'The "signature" particle of cosmic ray showers. Muons interact only via the weak force and electromagnetism, allowing them to penetrate deep underground. Relativistic time dilation extends their reach.',
    color: '#ff9ff3',
    icon: Wind,
    properties: [
      { label: 'Type', value: 'Lepton' },
      { label: 'Spin', value: '1/2' },
      { label: 'Range', value: '~km in rock' },
    ],
  },
  {
    id: 'electron',
    name: 'Electron',
    symbol: 'e⁻ / e⁺',
    role: 'The Cascade',
    mass: '0.511 MeV/c²',
    lifetime: 'Stable',
    charge: '∓1e',
    description: 'Electrons and positrons dominate the electromagnetic cascade. They radiate bremsstrahlung photons and undergo pair production, creating an exponential multiplication of particles.',
    color: '#54a0ff',
    icon: Circle,
    properties: [
      { label: 'Type', value: 'Lepton' },
      { label: 'Spin', value: '1/2' },
      { label: 'Critical E', value: '~85 MeV in air' },
    ],
  },
  {
    id: 'neutrino',
    name: 'Neutrino',
    symbol: 'νₑ / νᵤ / νᵩ',
    role: 'The Ghost',
    mass: '< 1 eV/c²',
    lifetime: 'Unknown (very long)',
    charge: '0',
    description: 'The most elusive particles. Produced in pion and muon decays, neutrinos interact so weakly that they escape the atmosphere entirely, carrying away energy and information about the shower.',
    color: '#1dd1a1',
    icon: Ghost,
    properties: [
      { label: 'Type', value: 'Lepton' },
      { label: 'Spin', value: '1/2' },
      { label: 'Cross-section', value: '~10⁻³⁸ cm²' },
    ],
  },
];

const ParticleZoo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const rotationRef = useRef(0);

  const activeParticle = particles[activeIndex];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        carouselRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % particles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isDragging]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + particles.length) % particles.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % particles.length);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    rotationRef.current = activeIndex * (360 / particles.length);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <section
      id="particles"
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-[#010101] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Orbital Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] border border-white/5 rounded-full animate-spin-slow" />
        <div className="absolute w-[400px] h-[400px] border border-white/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        <div className="absolute w-[200px] h-[200px] border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '15s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            The <span className="gradient-text">Particle Zoo</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Meet the cast of characters that make up an extensive air shower. 
            Each particle plays a unique role in the cosmic cascade.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Particle Orbit */}
          <div className="relative h-[400px] flex items-center justify-center mb-12">
            {particles.map((particle, index) => {
              const angle = (index - activeIndex) * (360 / particles.length);
              const radian = (angle * Math.PI) / 180;
              const radius = 200;
              const x = Math.sin(radian) * radius;
              const z = Math.cos(radian) * radius;
              const scale = (z + radius) / (2 * radius) * 0.5 + 0.5;
              const opacity = (z + radius) / (2 * radius) * 0.7 + 0.3;

              return (
                <button
                  key={particle.id}
                  onClick={() => setActiveIndex(index)}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
                    opacity,
                    zIndex: Math.round(z + radius),
                  }}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index === activeIndex
                        ? 'ring-4 ring-offset-4 ring-offset-black'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: particle.color,
                      boxShadow: index === activeIndex ? `0 0 40px ${particle.color}` : 'none',
                      '--tw-ring-color': index === activeIndex ? particle.color : 'transparent',
                    } as React.CSSProperties}
                  >
                    <particle.icon className="w-8 h-8 text-white" />
                  </div>
                  <div
                    className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium transition-all ${
                      index === activeIndex ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    {particle.symbol}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Particle Detail */}
          <div className="max-w-3xl mx-auto">
            <div
              className="p-8 rounded-2xl glass border transition-all duration-500"
              style={{ borderColor: `${activeParticle.color}30` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                    style={{ backgroundColor: `${activeParticle.color}20`, color: activeParticle.color }}
                  >
                    {activeParticle.role}
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white mb-1">
                    {activeParticle.name}
                  </h3>
                  <div className="text-xl text-white/60 font-mono">{activeParticle.symbol}</div>
                </div>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: activeParticle.color }}
                >
                  <activeParticle.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 leading-relaxed mb-8">{activeParticle.description}</p>

              {/* Properties Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Mass</div>
                  <div className="text-sm text-white font-mono">{activeParticle.mass}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Lifetime</div>
                  <div className="text-sm text-white font-mono">{activeParticle.lifetime}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Charge</div>
                  <div className="text-sm text-white font-mono">{activeParticle.charge}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Type</div>
                  <div className="text-sm text-white">{activeParticle.properties[0].value}</div>
                </div>
              </div>

              {/* Additional Properties */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid sm:grid-cols-3 gap-4">
                  {activeParticle.properties.map((prop, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: activeParticle.color }}
                      />
                      <div>
                        <div className="text-xs text-white/40">{prop.label}</div>
                        <div className="text-sm text-white">{prop.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {particles.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8'
                    : 'hover:bg-white/50'
                }`}
                style={{
                  backgroundColor: index === activeIndex ? activeParticle.color : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticleZoo;
