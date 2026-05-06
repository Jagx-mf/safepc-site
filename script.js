/* ============================================================
   SafePC — script.js
   ============================================================ */

/* ── Menu mobile ── */
const navToggle = document.querySelector('.nav-toggle');
const mainNav   = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fermer le menu si on clique en dehors
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── FAQ accordéon ── */
const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item   = button.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Fermer tous les autres
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ── Scroll reveal ── */
const revealItems = document.querySelectorAll('.section-reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ── Lien de navigation actif au scroll ── */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks  = document.querySelectorAll('.main-nav a[href^="#"]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const active = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-50% 0px -50% 0px' }
);

sections.forEach((s) => navObserver.observe(s));

/* ── Formulaire Formspree ── */
const contactForm = document.querySelector('#contact-form');
const submitBtn   = document.querySelector('#submit-btn');
const formStatus  = document.querySelector('#form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validation simple
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Vérification honeypot
    if (contactForm.querySelector('[name="_gotcha"]')?.value) return;

    // État chargement
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }
    formStatus.textContent = '✓ Message envoyé ! SafePC a bien reçu votre demande. Vous recevrez généralement une réponse sous 1 heure pendant les horaires d’ouverture.';
    formStatus.className = 'form-note';

    try {
      const data = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        formStatus.textContent = '✓ Message envoyé ! SafePC vous répondra dans les meilleurs délais.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        const json = await response.json().catch(() => ({}));
        throw new Error(json?.errors?.[0]?.message || 'Erreur réseau');
      }
    } catch (err) {
      formStatus.textContent =
        'Une erreur est survenue. Appelez directement le 06 86 11 28 71 ou écrivez à contactsafepc@gmail.com.';
      formStatus.classList.add('error');
      console.error('Formspree error:', err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer ma demande';
      }
    }
  });
}

/* ── Lien Facebook : avertissement si URL non configurée ── */
const fbLink = document.querySelector('.btn-facebook');
if (fbLink && fbLink.href.includes('VOTRE_PAGE_SAFEPC')) {
  fbLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Pensez à remplacer le lien Facebook dans le HTML par votre vraie page SafePC.');
  });
}
