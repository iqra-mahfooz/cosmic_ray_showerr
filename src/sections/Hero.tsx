import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronDown, Sparkles } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particleCount = window.innerWidth < 768 ? 80 : 150;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      color: ['#4a90e2', '#a855f7', '#ec4899', '#ffffff'][Math.floor(Math.random() * 4)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction (only process every 5th particle for performance)
        if (i % 5 === 0 && mousePos.x !== 0) {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            particle.vx -= (dx / dist) * force * 0.02;
            particle.vy -= (dy / dist) * force * 0.02;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();

        // Draw connections (limited for performance)
        if (i % 3 === 0) {
          particlesRef.current.slice(i + 1, i + 5).forEach((other) => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = '#4a90e2';
              ctx.globalAlpha = (1 - dist / 100) * 0.2;
              ctx.stroke();
            }
          });
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Title animation
    tl.fromTo(
      titleRef.current,
      { scale: 0.8, opacity: 0, letterSpacing: '-10px' },
      { scale: 1, opacity: 1, letterSpacing: '0px', duration: 1.5 }
    );

    // Subtitle animation
    tl.fromTo(
      subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    );

    // CTA animation
    tl.fromTo(
      ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.5'
    );
  }, []);

  const scrollToIntroduction = () => {
    const element = document.querySelector('#introduction');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/nebula-bg.jpg"
          alt="Cosmic Nebula"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <Sparkles className="w-4 h-4 text-[#4a90e2]" />
          <span className="text-sm text-white/80">High Energy Physics Portfolio</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight"
        >
          <span className="block">COSMIC RAY</span>
          <span className="block gradient-text">SHOWER</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 font-light"
        >
          Journey into the heart of high-energy astrophysics. 
          Explore how single particles from distant galaxies 
          create spectacular cascades in Earth's atmosphere.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={scrollToIntroduction} className="btn-primary flex items-center justify-center gap-2">
            Start Exploration
            <ChevronDown className="w-5 h-5" />
          </button>
          <a
            href="#simulation"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#simulation')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-outline"
          >
            View Simulation
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Gradient Overlay Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#010101] to-transparent z-10" />
    </section>
  );
};

export default Hero;
