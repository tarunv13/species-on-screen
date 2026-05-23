import { gsap } from 'gsap';

export function initSpeciesGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.species-card');
  
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      
      // Filter cards with animation
      cards.forEach(card => {
        const ecosystem = card.dataset.ecosystem;
        const shouldShow = filter === 'all' || ecosystem === filter;
        
        if (shouldShow) {
          card.style.display = '';
          gsap.fromTo(card, 
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
          );
        } else {
          gsap.to(card, {
            opacity: 0, y: -10, scale: 0.95, duration: 0.25, ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
    });

    // Keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}
