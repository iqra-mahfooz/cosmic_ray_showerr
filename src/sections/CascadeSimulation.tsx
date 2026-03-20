import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, RotateCcw, Settings, Info } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SimParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'proton' | 'pion' | 'muon' | 'electron' | 'photon' | 'neutrino';
  energy: number;
  generation: number;
  lifetime: number;
  maxLifetime: number;
  children: number[];
  parent?: number;
}

const particleColors: Record<string, string> = {
  proton: '#ff6b6b',
  pion: '#feca57',
  muon: '#ff9ff3',
  electron: '#54a0ff',
  photon: '#48dbfb',
  neutrino: '#1dd1a1',
};

const particleNames: Record<string, string> = {
  proton: 'Proton (p)',
  pion: 'Pion (π)',
  muon: 'Muon (μ)',
  electron: 'Electron (e⁻)',
  photon: 'Photon (γ)',
  neutrino: 'Neutrino (ν)',
};

const CascadeSimulation = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [primaryParticle, setPrimaryParticle] = useState<'proton' | 'iron'>('proton');
  const [energy, setEnergy] = useState(15);
  const [particleCount, setParticleCount] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  
  const particlesRef = useRef<SimParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const particleIdCounter = useRef(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Create initial particle
  const createInitialParticle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particleIdCounter.current = 0;
    const initialEnergy = Math.pow(10, energy);
    
    particlesRef.current = [{
      id: particleIdCounter.current++,
      x: canvas.width / 2,
      y: 50,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 2 + Math.random(),
      type: primaryParticle === 'proton' ? 'proton' : 'proton',
      energy: initialEnergy,
      generation: 0,
      lifetime: 0,
      maxLifetime: 200 + Math.random() * 100,
      children: [],
    }];
    
    setParticleCount(1);
  }, [primaryParticle, energy]);

  // Particle physics simulation
  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newParticles: SimParticle[] = [];
    
    particlesRef.current.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.lifetime++;

      // Boundary check
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }

      // Decay and interaction logic
      const decayProbability = 0.02 * (particle.generation + 1);
      
      if (particle.lifetime > 30 && Math.random() < decayProbability && particle.energy > 100) {
        const numChildren = particle.type === 'proton' ? 3 : particle.type === 'pion' ? 2 : 0;
        
        for (let i = 0; i < numChildren; i++) {
          if (particleIdCounter.current > 500) break; // Limit total particles
          
          let childType: SimParticle['type'];
          if (particle.type === 'proton') {
            childType = Math.random() < 0.6 ? 'pion' : 'muon';
          } else if (particle.type === 'pion') {
            childType = Math.random() < 0.5 ? 'muon' : 'electron';
          } else {
            childType = 'electron';
          }

          const angle = (Math.PI * 2 * i) / numChildren + Math.random() * 0.5;
          const speed = 1 + Math.random();
          
          const child: SimParticle = {
            id: particleIdCounter.current++,
            x: particle.x,
            y: particle.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed + 0.5,
            type: childType,
            energy: particle.energy / numChildren,
            generation: particle.generation + 1,
            lifetime: 0,
            maxLifetime: 150 + Math.random() * 100,
            children: [],
            parent: particle.id,
          };
          
          particle.children.push(child.id);
          newParticles.push(child);
        }
        
        // Reduce parent energy
        particle.energy *= 0.3;
      }

      // Photon pair production
      if (particle.type === 'photon' && particle.energy > 100 && Math.random() < 0.03) {
        for (let i = 0; i < 2; i++) {
          if (particleIdCounter.current > 500) break;
          
          const angle = (Math.PI * i) + Math.random() * 0.3;
          const child: SimParticle = {
            id: particleIdCounter.current++,
            x: particle.x,
            y: particle.y,
            vx: Math.cos(angle) * 1.5,
            vy: Math.sin(angle) * 1.5 + 0.3,
            type: 'electron',
            energy: particle.energy / 2,
            generation: particle.generation + 1,
            lifetime: 0,
            maxLifetime: 100 + Math.random() * 50,
            children: [],
            parent: particle.id,
          };
          newParticles.push(child);
        }
        particle.energy = 0; // Photon is consumed
      }
    });

    // Remove dead particles and add new ones
    particlesRef.current = particlesRef.current.filter(
      (p) => p.lifetime < p.maxLifetime && p.energy > 10 && p.y < canvas.height + 50
    );
    particlesRef.current.push(...newParticles);
    
    setParticleCount(particlesRef.current.length);
  }, []);

  // Render particles
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear with fade effect
    ctx.fillStyle = 'rgba(1, 1, 1, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw atmospheric layers
    const layerHeight = canvas.height / 5;
    ctx.strokeStyle = 'rgba(74, 144, 226, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * layerHeight);
      ctx.lineTo(canvas.width, i * layerHeight);
      ctx.stroke();
    }

    // Draw particles
    particlesRef.current.forEach((particle) => {
      const alpha = Math.max(0, 1 - particle.lifetime / particle.maxLifetime);
      const color = particleColors[particle.type];
      
      // Draw trail
      if (particle.lifetime > 1) {
        ctx.beginPath();
        ctx.moveTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
        ctx.lineTo(particle.x, particle.y);
        ctx.strokeStyle = color + Math.floor(alpha * 100).toString(16).padStart(2, '0');
        ctx.lineWidth = Math.max(1, 3 - particle.generation);
        ctx.stroke();
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, Math.max(2, 4 - particle.generation * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
      
      // Glow effect for high-energy particles
      if (particle.energy > 1000 && particle.generation < 2) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = color + '20';
        ctx.fill();
      }
    });
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      updateParticles();
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, updateParticles, render]);

  // Scroll animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
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

  const toggleSimulation = () => {
    if (!isRunning && particlesRef.current.length === 0) {
      createInitialParticle();
    }
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    createInitialParticle();
    
    // Clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#010101';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <section
      id="simulation"
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-[#010101]"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            The <span className="gradient-text">Cascade Effect</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Watch how a single high-energy particle initiates a chain reaction, 
            creating a spectacular shower of secondary particles as it traverses the atmosphere.
          </p>
        </div>

        {/* Simulation Container */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden border border-white/10"
        >
          {/* Canvas */}
          <div className="relative h-[500px] sm:h-[600px] bg-[#010101]">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
            
            {/* Atmospheric Labels */}
            <div className="absolute left-4 top-4 text-xs text-white/30">Exosphere (100km)</div>
            <div className="absolute left-4 top-[20%] text-xs text-white/30">Thermosphere</div>
            <div className="absolute left-4 top-[40%] text-xs text-white/30">Mesosphere</div>
            <div className="absolute left-4 top-[60%] text-xs text-white/30">Stratosphere</div>
            <div className="absolute left-4 top-[80%] text-xs text-white/30">Troposphere</div>
            <div className="absolute left-4 bottom-4 text-xs text-white/30">Surface</div>

            {/* Particle Legend */}
            {showInfo && (
              <div className="absolute top-4 right-4 p-4 glass rounded-lg">
                <div className="text-xs text-white/50 mb-2 uppercase tracking-wider">Particle Types</div>
                <div className="space-y-2">
                  {Object.entries(particleColors).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-white/70">{particleNames[type]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Particle Count */}
            <div className="absolute bottom-4 right-4 px-4 py-2 glass rounded-lg">
              <div className="text-xs text-white/50">Active Particles</div>
              <div className="text-2xl font-display font-bold text-white">{particleCount}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-black/50 backdrop-blur-md border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Left Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSimulation}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isRunning
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-[#4a90e2] text-white hover:bg-[#3a7bc8]'
                  }`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              {/* Center - Settings */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-white/50" />
                  <select
                    value={primaryParticle}
                    onChange={(e) => setPrimaryParticle(e.target.value as 'proton' | 'iron')}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4a90e2]"
                  >
                    <option value="proton">Proton (p)</option>
                    <option value="iron">Iron Nucleus (Fe)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/50">Energy:</span>
                  <input
                    type="range"
                    min="12"
                    max="18"
                    step="1"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-32 accent-[#4a90e2]"
                  />
                  <span className="text-sm text-white font-mono">10^{energy} eV</span>
                </div>
              </div>

              {/* Right - Info Toggle */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-3 rounded-lg transition-all ${
                  showInfo ? 'bg-[#4a90e2]/20 text-[#4a90e2]' : 'text-white/50 hover:bg-white/10'
                }`}
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Physics Explanation */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Hadronic Interactions',
              description: 'Primary protons collide with atmospheric nuclei, producing pions (π⁺, π⁻, π⁰) and other hadrons.',
              color: '#ff6b6b',
            },
            {
              title: 'Electromagnetic Cascade',
              description: 'Neutral pions decay into photons (π⁰ → γγ), which pair-produce electrons, creating an EM cascade.',
              color: '#54a0ff',
            },
            {
              title: 'Muon Component',
              description: 'Charged pions decay into muons (π± → μ± + ν), which penetrate deeply due to weak interactions.',
              color: '#ff9ff3',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-xl glass hover:bg-white/10 transition-all duration-300"
            >
              <div
                className="w-3 h-3 rounded-full mb-4"
                style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
              />
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CascadeSimulation;
