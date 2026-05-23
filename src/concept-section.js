/**
 * Concept section interactivity.
 * Adds subtle hover/focus effects to concept cards via CSS class toggling.
 */

export function initConceptSection() {
  const cards = document.querySelectorAll('.concept-card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('concept-card--active');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('concept-card--active');
    });

    card.addEventListener('focusin', () => {
      card.classList.add('concept-card--active');
    });

    card.addEventListener('focusout', () => {
      card.classList.remove('concept-card--active');
    });
  });
}
