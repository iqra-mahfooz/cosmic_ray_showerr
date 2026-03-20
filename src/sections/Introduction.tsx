import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Wind, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Target, value: '99%', label: 'Protons & Nuclei', description: 'Primary cosmic ray composition' },
  { icon: Zap, value: '10²⁰', label: 'eV Energy Range', description: 'Maximum observed energy' },
  { icon: Wind, value: '~1000', label: 'particles/m²/s', description: 'Flux at sea level' },
];

const Introduction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );

      // Text stagger
      gsap.fromTo(
        textRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
          },
        }
      );

      // Image reveal
      gsap.fromTo(
        imageRef.current,
        { scale: 1.2, clipPath: 'circle(0% at 50% 50%)' },
        {
          scale: 1,
          clipPath: 'circle(100% at 50% 50%)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
          },
        }
      );

      // Stats animation
      gsap.fromTo(
        statsRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="introduction"
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-[#010101]"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text */}
          <div>
            <h2
              ref={headingRef}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8"
            >
              What are
              <span className="block gradient-text">Cosmic Rays?</span>
            </h2>

            <div ref={textRef} className="space-y-6 text-white/70 text-lg leading-relaxed">
              <p>
                Cosmic rays are high-energy particles that travel through space at nearly the 
                speed of light. Originating from distant astrophysical sources like supernovae, 
                active galactic nuclei, and possibly even more exotic phenomena, these particles 
                carry invaluable information about the universe's most energetic processes.
              </p>
              <p>
                When cosmic rays strike Earth's atmosphere, they create spectacular cascades of 
                secondary particles called <strong className="text-white">Extensive Air Showers (EAS)</strong>. 
                A single primary particle with energy of 10¹⁵ eV can produce a shower containing 
                millions of secondary particles spread over several square kilometers.
              </p>
              <p>
                These showers consist of three main components: an{' '}
                <span className="text-[#4a90e2]">electromagnetic cascade</span> (electrons, 
                positrons, and photons), a{' '}
                <span className="text-[#a855f7]">hadronic core</span> (protons, neutrons, pions), 
                and deeply penetrating <span className="text-[#ec4899]">muons</span> that can 
                reach the Earth's surface.
              </p>
            </div>

            {/* Divider */}
            <div className="my-10 h-px bg-gradient-to-r from-[#4a90e2] via-[#a855f7] to-transparent" />

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-xl glass hover:bg-white/10 transition-all duration-300 cursor-default"
                >
                  <stat.icon className="w-6 h-6 text-[#4a90e2] mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-white/40">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/cosmic-impact.jpg"
                alt="Cosmic Ray Atmospheric Cascade"
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#010101]/60 via-transparent to-transparent" />
            </div>

            {/* Floating Label */}
            <div className="absolute -bottom-4 -left-4 px-6 py-3 glass rounded-lg">
              <div className="text-sm text-white/60">Atmospheric Cascade</div>
              <div className="text-lg font-display font-semibold text-white">
                ~15 km Altitude
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#4a90e2]/30 rounded-full animate-pulse-glow" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-[#a855f7]/20 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
