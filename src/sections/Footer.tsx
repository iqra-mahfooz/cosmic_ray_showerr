import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Atom, Github, BookOpen, Mail, ExternalLink, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const references = [
  {
    title: 'Heitler, W. (1944)',
    description: 'The Quantum Theory of Radiation',
    link: '#',
  },
  {
    title: 'Matthews, J. (2005)',
    description: 'A Heitler model of extensive air showers',
    link: 'https://arxiv.org/abs/astro-ph/0402234',
  },
  {
    title: 'Pierre Auger Collaboration',
    description: 'The Pierre Auger Cosmic Ray Observatory',
    link: 'https://www.auger.org',
  },
  {
    title: 'Particle Data Group',
    description: 'Review of Particle Physics',
    link: 'https://pdg.lbl.gov',
  },
];

const resources = [
  { title: 'CORSIKA Simulation', link: 'https://web.ikp.kit.edu/corsika/' },
  { title: 'Geant4 Toolkit', link: 'https://geant4.web.cern.ch/' },
  { title: 'CRPropa', link: 'https://crpropa.github.io/' },
  { title: 'COSMOS Code', link: '#' },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      // Reveal animation
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 80%',
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#010101] pt-24 pb-12"
    >
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#010101]" />

      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4a90e2] to-[#a855f7] flex items-center justify-center">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-white">COSMIC RAY</div>
                <div className="text-sm text-white/50">Shower Physics</div>
              </div>
            </div>
            
            <p className="text-white/60 mb-6 leading-relaxed">
              An interactive exploration of high-energy astrophysics, 
              demonstrating the beauty and complexity of cosmic ray air showers 
              through computational physics and visualization.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg glass hover:bg-white/10 transition-all"
              >
                <Github className="w-5 h-5 text-white/70" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="p-3 rounded-lg glass hover:bg-white/10 transition-all"
              >
                <Mail className="w-5 h-5 text-white/70" />
              </a>
            </div>
          </div>

          {/* References */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4a90e2]" />
              Key References
            </h3>
            <ul className="space-y-4">
              {references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-white/60 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <div className="text-sm font-medium">{ref.title}</div>
                      <div className="text-xs text-white/40">{ref.description}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Atom className="w-5 h-5 text-[#a855f7]" />
              Simulation Tools
            </h3>
            <ul className="space-y-3">
              {resources.map((res, i) => (
                <li key={i}>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {res.title}
                  </a>
                </li>
              ))}
            </ul>

            {/* Tech Stack */}
            <div className="mt-8">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-3">
                Built With
              </div>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs bg-white/5 rounded-full text-white/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/40">
            © 2026 Cosmic Ray Shower Project. Built for physics portfolio.
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/40">
            Made with love for physics enthusiasts
          </div>
        </div>

        {/* Quote */}
        <div className="mt-12 text-center">
          <blockquote className="text-lg text-white/30 italic">
            "The universe is not only queerer than we suppose, but queerer than we can suppose."
          </blockquote>
          <cite className="text-sm text-white/20 mt-2 block">— J.B.S. Haldane</cite>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
