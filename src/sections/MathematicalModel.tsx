import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { Calculator, BookOpen, Lightbulb } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface EquationCardProps {
  title: string;
  equation: string;
  description: string;
  variables: { symbol: string; meaning: string }[];
  delay: number;
}

const EquationCard = ({ title, equation, description, variables, delay }: EquationCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const equationRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (equationRef.current) {
      katex.render(equation, equationRef.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [equation]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { rotateX: 90, opacity: 0 },
      {
        rotateX: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      }
    );
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 cursor-pointer ${
        isExpanded ? 'md:col-span-2 lg:col-span-1' : ''
      }`}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#4a90e2]/10 rounded-lg">
            <Calculator className="w-5 h-5 text-[#4a90e2]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        {/* Equation */}
        <div
          ref={equationRef}
          className="py-6 px-4 bg-gray-50 rounded-xl mb-6 overflow-x-auto"
        />

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">{description}</p>

        {/* Variables */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Variables
          </div>
          <div className="grid gap-2">
            {variables.map((v, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="font-mono text-[#4a90e2] font-semibold min-w-[60px]">
                  {v.symbol}
                </span>
                <span className="text-gray-600">{v.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#4a90e2]/10 to-transparent" />
    </div>
  );
};

const MathematicalModel = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const equations: EquationCardProps[] = [
    {
      title: 'Particle Multiplication',
      equation: 'N(t) = 2^{t/\\lambda}',
      description: 'The number of particles in the shower grows exponentially with depth, doubling after each radiation length.',
      variables: [
        { symbol: 'N(t)', meaning: 'Number of particles at depth t' },
        { symbol: 't', meaning: 'Atmospheric depth (g/cm²)' },
        { symbol: 'λ', meaning: 'Radiation length (~37 g/cm² in air)' },
      ],
      delay: 0,
    },
    {
      title: 'Energy Degradation',
      equation: 'E(t) = \\frac{E_0}{2^{t/\\lambda}}',
      description: 'As the shower develops, energy is divided among an increasing number of particles.',
      variables: [
        { symbol: 'E(t)', meaning: 'Energy per particle at depth t' },
        { symbol: 'E₀', meaning: 'Primary particle energy' },
        { symbol: 't', meaning: 'Atmospheric depth' },
        { symbol: 'λ', meaning: 'Radiation length' },
      ],
      delay: 0.2,
    },
    {
      title: 'Shower Maximum',
      equation: 'X_{max} = \\lambda \\ln\\left(\\frac{E_0}{E_c}\\right)',
      description: 'The depth at which the shower reaches maximum particle count depends logarithmically on primary energy.',
      variables: [
        { symbol: 'Xₘₐₓ', meaning: 'Depth of shower maximum' },
        { symbol: 'E₀', meaning: 'Primary energy' },
        { symbol: 'E_c', meaning: 'Critical energy (~85 MeV in air)' },
        { symbol: 'λ', meaning: 'Radiation length' },
      ],
      delay: 0.4,
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
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

  return (
    <section
      id="physics"
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-white"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(#000 1px, transparent 1px),
              linear-gradient(90deg, #000 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4a90e2]/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-[#4a90e2]" />
            <span className="text-sm text-[#4a90e2] font-medium">Heitler-Matthews Model</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Mathematical <span className="text-[#4a90e2]">Framework</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The Heitler model provides an elegant analytical description of electromagnetic cascades, 
            treating particle multiplication as a simple branching process where each particle splits 
            into two after traversing one radiation length.
          </p>
        </div>

        {/* Equation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {equations.map((eq, index) => (
            <EquationCard key={index} {...eq} />
          ))}
        </div>

        {/* Key Insights */}
        <div className="bg-gray-900 rounded-2xl p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-display font-bold text-white">Key Physical Insights</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Logarithmic Energy Dependence
              </h4>
              <p className="text-gray-400 leading-relaxed">
                The shower maximum depth grows only logarithmically with primary energy. 
                This means a 10× increase in energy moves Xₘₐₓ deeper by only ~λ ln(10) ≈ 85 g/cm², 
                or about 2-3 radiation lengths in the atmosphere.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Mass Composition Sensitivity
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Heavier nuclei (like iron) produce showers with smaller Xₘₐₓ compared to protons 
                of the same energy, because the energy is divided among nucleons. This makes 
                Xₘₐₓ a powerful probe of cosmic ray composition.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Muon Production
              </h4>
              <p className="text-gray-400 leading-relaxed">
                The number of muons scales as Nₘᵤ ∝ E₀^β where β ≈ 0.9-0.95. This sub-linear 
                scaling arises because higher energy showers develop higher in the atmosphere, 
                giving pions more time to decay before interacting.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Fluctuations & Universality
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Despite large event-to-event fluctuations, shower profiles exhibit remarkable 
                universality when normalized to Xₘₐₓ. This property enables accurate energy 
                reconstruction using fluorescence detectors.
              </p>
            </div>
          </div>
        </div>

        {/* Extended Formula Section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-[#4a90e2]/5 to-[#a855f7]/5 rounded-2xl border border-[#4a90e2]/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Extended Heitler-Matthews Model</h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                For hadronic showers, the model is extended to account for the different 
                interaction lengths and particle production:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">Muon Number Scaling</div>
                  <div 
                    className="text-lg"
                    ref={(el) => {
                      if (el) katex.render('N_\\mu \\propto A^{1-\\beta} \\left(\\frac{E_0}{E_{th}}\\right)^\\beta', el, { throwOnError: false });
                    }}
                  />
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">Elongation Rate</div>
                  <div 
                    className="text-lg"
                    ref={(el) => {
                      if (el) katex.render('\\frac{dX_{max}}{d\\ln E} = \\lambda_{int} - \\lambda_{rad} \\ln(2)', el, { throwOnError: false });
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
                  <div className="text-4xl font-display font-bold gradient-text mb-2">~60</div>
                  <div className="text-sm text-gray-500">particles/m² at sea level</div>
                  <div className="text-xs text-gray-400 mt-1">for a 10¹⁵ eV primary</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MathematicalModel;
