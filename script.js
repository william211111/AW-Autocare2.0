// ==========================================================================
// AW-autocare — shared behaviour
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Booking form ---------- */
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {

    // Pre-select package if it arrives via ?pakke=lille / mellem / suv
    const params = new URLSearchParams(window.location.search);
    const pre = params.get('pakke');
    if (pre) {
      const input = bookingForm.querySelector(`input[name="pakke"][value="${pre}"]`);
      if (input) input.checked = true;
    }

    // Don't allow picking a date in the past
    const dateInput = bookingForm.querySelector('#dato');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      // NOTE for developer wiring this up to a real backend:
      // Replace this block with an actual request, e.g.
      //   fetch('/api/booking', { method: 'POST', body: new FormData(bookingForm) })
      // or point the <form> action at a booking/email service (Formspree, Netlify Forms osv.).
      // For now the request is simulated so the page works stand-alone.

      const data = new FormData(bookingForm);
      const pakkeLabels = { lille: 'Lille bil — 499 kr', mellem: 'Mellem bil — 699 kr', suv: 'SUV / stor bil — 999 kr' };
      const chosen = pakkeLabels[data.get('pakke')] || '';

      const summaryEl = document.getElementById('booking-summary');
      if (summaryEl) {
        summaryEl.innerHTML = `
          <li><span class="label">Navn</span><span class="value">${escapeHTML(data.get('navn'))}</span></li>
          <li><span class="label">Pakke</span><span class="value">${escapeHTML(chosen)}</span></li>
          <li><span class="label">Dato</span><span class="value">${escapeHTML(data.get('dato'))} kl. ${escapeHTML(data.get('tid'))}</span></li>
        `;
      }

      bookingForm.closest('.form-card').classList.add('is-hidden');
      document.getElementById('booking-success').classList.add('is-visible');
      document.getElementById('booking-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      // Same note as above — wire this up to a real endpoint or mail service.
      contactForm.closest('.form-card').classList.add('is-hidden');
      document.getElementById('contact-success').classList.add('is-visible');
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
});
