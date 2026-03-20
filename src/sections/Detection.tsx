import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Satellite, Eye, Waves, MapPin, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DetectorMethod {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  principle: string;
  advantages: string[];
  examples: string[];
  color: string;
}

const detectionMethods: DetectorMethod[] = [
  {
    id: 'surface',
    title: 'Surface Detector Arrays',
    icon: MapPin,
    description: 'Arrays of particle detectors spread over large areas sample the shower particles that reach ground level.',
    principle: 'Cherenkov detectors or scintillation counters measure the density and arrival time of secondary particles at the surface.',
    advantages: [
      'Operates 24/7 regardless of weather',
      'High duty cycle (>95%)',
      'Direct measurement of muon component',
      'Good angular resolution',
    ],
    examples: ['Pierre Auger Observatory', 'Telescope Array', 'KASCADE', 'Tibet ASγ'],
    color: '#4a90e2',
  },
  {
    id: 'fluorescence',
    title: 'Fluorescence Detectors',
    icon: Eye,
    description: 'Telescopes observe the faint ultraviolet light emitted by nitrogen molecules excited by shower particles.',
    principle: 'Charged particles excite N₂ molecules; de-excitation produces UV fluorescence (300-400 nm) proportional to energy deposit.',
    advantages: [
      'Calorimetric energy measurement',
      'Direct observation of shower profile',
      'Excellent Xₘₐₓ resolution',
      'Nearly model-independent energy',
    ],
    examples: ['HiRes', 'Pierre Auger FD', 'TA FD', 'EUSO (planned)'],
    color: '#a855f7',
  },
  {
    id: 'radio',
    title: 'Radio Detection',
    icon: Waves,
    description: 'Antenna arrays detect coherent radio emission from shower electrons deflected by Earth\'s magnetic field.',
    principle: 'Askaryan effect + geomagnetic emission produce MHz-GHz radio pulses with 100% duty cycle.',
    advantages: [
      'Very high duty cycle',
      'Cost-effective for large areas',
      'Sensitive to shower maximum',
      'Complementary to other methods',
    ],
    examples: ['LOFAR', 'AERA (Auger)', 'Tunka-Rex', 'GRAND (planned)'],
    color: '#1dd1a1',
  },
];

const majorObservatories = [
  {
    name: 'Pierre Auger Observatory',
    location: 'Malargüe, Argentina',
    description: 'The world\'s largest cosmic ray observatory, covering 3,000 km² with 1,660 surface detectors and 27 fluorescence telescopes.',
    stats: { area: '3,000 km²', energy: '10¹⁸ - 10²⁰ eV', since: '2004' },
  },
  {
    name: 'Telescope Array',
    location: 'Utah, USA',
    description: 'The largest cosmic ray detector in the Northern Hemisphere, combining surface array and fluorescence detection.',
    stats: { area: '762 km²', energy: '10¹⁸ - 10²⁰ eV', since: '2008' },
  },
  {
    name: 'KASCADE-Grande',
    location: 'Karlsruhe, Germany',
    description: 'Studies cosmic rays in the knee region (10¹⁵ - 10¹⁸ eV) with a dense array of detectors for detailed measurements.',
    stats: { area: '0.5 km²', energy: '10¹⁵ - 10¹⁸ eV', since: '1996' },
  },
];

const Detection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeMethod, setActiveMethod] = useState(detectionMethods[0]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image zoom effect
      const img = imageRef.current?.querySelector('img');
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1 },
          {
            scale: 1.2,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="detection"
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-[#010101]"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <Satellite className="w-4 h-4 text-[#4a90e2]" />
            <span className="text-sm text-white/70">Experimental Physics</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Detecting the <span className="gradient-text">Invisible</span>
          </h2>
          
          <p className="text-lg text-white/60 max-w-3xl mx-auto">
            Cosmic ray showers cannot be observed directly. Instead, physicists have developed 
            ingenious indirect detection methods to reconstruct the properties of the primary particle 
            from the secondary particles that reach Earth's surface.
          </p>
        </div>

        {/* Detection Methods Tabs */}
        <div className="mb-16">
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {detectionMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setActiveMethod(method)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeMethod.id === method.id
                    ? 'glass border-2'
                    : 'hover:bg-white/5'
                }`}
                style={{
                  borderColor: activeMethod.id === method.id ? method.color : 'transparent',
                }}
              >
                <method.icon
                  className="w-5 h-5"
                  style={{ color: method.color }}
                />
                <span className={`font-medium ${
                  activeMethod.id === method.id ? 'text-white' : 'text-white/60'
                }`}>
                  {method.title}
                </span>
              </button>
            ))}
          </div>

          {/* Active Method Content */}
          <div
            className="p-8 rounded-2xl glass border transition-all duration-500"
            style={{ borderColor: `${activeMethod.color}30` }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  {activeMethod.title}
                </h3>
                <p className="text-white/70 mb-6">{activeMethod.description}</p>
                
                <div className="mb-6">
                  <div className="text-sm text-white/40 uppercase tracking-wider mb-2">
                    Physical Principle
                  </div>
                  <p className="text-white/60 text-sm">{activeMethod.principle}</p>
                </div>

                <div>
                  <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
                    Key Advantages
                  </div>
                  <ul className="space-y-2">
                    {activeMethod.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2"
                          style={{ backgroundColor: activeMethod.color }}
                        />
                        <span className="text-white/70 text-sm">{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
                  Major Experiments
                </div>
                <div className="space-y-3">
                  {activeMethod.examples.map((example, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <ExternalLink
                        className="w-4 h-4"
                        style={{ color: activeMethod.color }}
                      />
                      <span className="text-white">{example}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Representation */}
                <div className="mt-6 p-6 bg-white/5 rounded-xl">
                  <div className="text-sm text-white/40 mb-4">Detection Schematic</div>
                  <div className="relative h-32">
                    {/* Simple schematic visualization */}
                    <svg className="w-full h-full" viewBox="0 0 300 100">
                      {/* Shower */}
                      <g opacity="0.5">
                        <line x1="150" y1="10" x2="100" y2="90" stroke="white" strokeWidth="1" />
                        <line x1="150" y1="10" x2="120" y2="90" stroke="white" strokeWidth="1" />
                        <line x1="150" y1="10" x2="140" y2="90" stroke="white" strokeWidth="1" />
                        <line x1="150" y1="10" x2="160" y2="90" stroke="white" strokeWidth="1" />
                        <line x1="150" y1="10" x2="180" y2="90" stroke="white" strokeWidth="1" />
                        <line x1="150" y1="10" x2="200" y2="90" stroke="white" strokeWidth="1" />
                      </g>
                      
                      {/* Detectors */}
                      {activeMethod.id === 'surface' && (
                        <>
                          <circle cx="80" cy="85" r="8" fill={activeMethod.color} opacity="0.6" />
                          <circle cx="120" cy="88" r="8" fill={activeMethod.color} opacity="0.6" />
                          <circle cx="160" cy="85" r="8" fill={activeMethod.color} opacity="0.6" />
                          <circle cx="200" cy="88" r="8" fill={activeMethod.color} opacity="0.6" />
                          <circle cx="240" cy="85" r="8" fill={activeMethod.color} opacity="0.6" />
                        </>
                      )}
                      
                      {activeMethod.id === 'fluorescence' && (
                        <>
                          <ellipse cx="30" cy="50" rx="15" ry="25" fill={activeMethod.color} opacity="0.4" />
                          <path d="M 45 40 L 80 30" stroke={activeMethod.color} strokeWidth="2" strokeDasharray="4" />
                          <path d="M 45 60 L 80 70" stroke={activeMethod.color} strokeWidth="2" strokeDasharray="4" />
                        </>
                      )}
                      
                      {activeMethod.id === 'radio' && (
                        <>
                          <line x1="100" y1="85" x2="100" y2="65" stroke={activeMethod.color} strokeWidth="2" />
                          <line x1="150" y1="88" x2="150" y2="68" stroke={activeMethod.color} strokeWidth="2" />
                          <line x1="200" y1="85" x2="200" y2="65" stroke={activeMethod.color} strokeWidth="2" />
                          <circle cx="100" cy="60" r="8" fill="none" stroke={activeMethod.color} strokeWidth="2" />
                          <circle cx="150" cy="63" r="8" fill="none" stroke={activeMethod.color} strokeWidth="2" />
                          <circle cx="200" cy="60" r="8" fill="none" stroke={activeMethod.color} strokeWidth="2" />
                          <path d="M 90 50 Q 100 40 110 50" stroke={activeMethod.color} fill="none" opacity="0.5" />
                          <path d="M 140 53 Q 150 43 160 53" stroke={activeMethod.color} fill="none" opacity="0.5" />
                          <path d="M 190 50 Q 200 40 210 50" stroke={activeMethod.color} fill="none" opacity="0.5" />
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observatory Image */}
        <div ref={imageRef} className="relative rounded-2xl overflow-hidden mb-16">
          <img
            src="/auger-observatory.jpg"
            alt="Pierre Auger Observatory"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="text-sm text-white/50 mb-2">Pierre Auger Observatory</div>
            <div className="text-2xl font-display font-bold text-white">
              The World's Largest Cosmic Ray Detector
            </div>
          </div>
        </div>

        {/* Major Observatories */}
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-8 text-center">
            Major Observatories
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {majorObservatories.map((obs, i) => (
              <div
                key={i}
                className="p-6 rounded-xl glass hover:bg-white/10 transition-all duration-300 card-hover"
              >
                <h4 className="text-lg font-semibold text-white mb-2">{obs.name}</h4>
                <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                  <MapPin className="w-4 h-4" />
                  {obs.location}
                </div>
                <p className="text-sm text-white/60 mb-6">{obs.description}</p>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs text-white/40">Area</div>
                    <div className="text-sm text-white font-mono">{obs.stats.area}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40">Energy</div>
                    <div className="text-sm text-white font-mono">{obs.stats.energy}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40">Since</div>
                    <div className="text-sm text-white font-mono">{obs.stats.since}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detection;
