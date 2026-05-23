import { gsap } from 'gsap';

/**
 * Hero section - ambient particle system and entrance animations
 * Particles are barely-noticeable floating motes, like dust in morning sunlight.
 */

const PARTICLE_COUNT = 50;
const COLORS = [
  'rgba(168, 197, 160, 0.4)', // forest green
  'rgba(142, 202, 230, 0.35)', // water blue
  'rgba(212, 165, 116, 0.3)', // savanna ochre
  'rgba(232, 228, 240, 0.4)', // ice lavender
  'rgba(200, 210, 190, 0.35)', // pale sage
];

class Particle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 2 + Math.random() * 3;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.2 - 0.1;
    this.phaseX = Math.random() * Math.PI * 2;
    this.phaseY = Math.random() * Math.PI * 2;
    this.freqX = 0.002 + Math.random() * 0.003;
    this.freqY = 0.001 + Math.random() * 0.002;
    this.amplitude = 20 + Math.random() * 30;
  }

  update(time, width, height) {
    this.x += this.speedX + Math.sin(time * this.freqX + this.phaseX) * 0.3;
    this.y += this.speedY + Math.cos(time * this.freqY + this.phaseY) * 0.2;

    // Wrap around edges
    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let animationId = null;
let resizeHandler = null;

export function initHero() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create canvas for particles
  const canvas = document.createElement('canvas');
  canvas.classList.add('hero__particles');
  canvas.setAttribute('aria-hidden', 'true');
  heroSection.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let startTime = performance.now();

  function resize() {
    const rect = heroSection.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }
  }

  function animate() {
    const time = performance.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
      particle.update(time, canvas.width, canvas.height);
      particle.draw(ctx);
    }

    animationId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();

  resizeHandler = () => {
    resize();
    createParticles();
  };

  window.addEventListener('resize', resizeHandler);

  // Start particle animation (skip if reduced motion)
  if (!prefersReducedMotion) {
    animate();
  }

  // Entrance animations
  const title = heroSection.querySelector('.hero__title');
  const subtitle = heroSection.querySelector('.hero__subtitle');
  const scrollHint = heroSection.querySelector('.hero__scroll-hint');

  if (prefersReducedMotion) {
    // Just show everything immediately
    gsap.set([title, subtitle, canvas, scrollHint], { opacity: 1 });
    return;
  }

  // Set initial states
  gsap.set(title, { opacity: 0, y: 30 });
  gsap.set(subtitle, { opacity: 0, y: 20 });
  gsap.set(canvas, { opacity: 0 });
  gsap.set(scrollHint, { opacity: 0 });

  // Animate in
  gsap.to(title, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    delay: 0.3,
    ease: 'power2.out',
  });

  gsap.to(subtitle, {
    opacity: 1,
    y: 0,
    duration: 1.0,
    delay: 0.8,
    ease: 'power2.out',
  });

  gsap.to(canvas, {
    opacity: 0.6,
    duration: 2,
    delay: 0.5,
    ease: 'power1.out',
  });

  gsap.to(scrollHint, {
    opacity: 1,
    duration: 0.8,
    delay: 2.0,
    ease: 'power1.out',
  });
}

export function destroyHero() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
}
