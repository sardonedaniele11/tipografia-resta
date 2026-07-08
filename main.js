document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scrolled Class ---
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMenu() {
    mobileToggle.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  }

  mobileToggle.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // --- Scroll Active Navigation Links Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 150; // offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Portfolio Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Force reflow for fade in effect
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Delay display none to let transition finish
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Portfolio Lightbox ---
  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxDesc = document.getElementById('lightbox-desc');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.item-title').textContent;
      const category = item.querySelector('.item-category').textContent;
      const desc = item.querySelector('.item-desc').textContent;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxCat.textContent = category;
      lightboxDesc.textContent = desc;

      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // --- File Upload UI Feedback ---
  const fileInput = document.getElementById('file-bozza');
  const fileNameDisplay = document.querySelector('.file-name-display');

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileNameDisplay.textContent = e.target.files[0].name;
    } else {
      fileNameDisplay.textContent = 'Nessun file selezionato';
    }
  });

  // --- Form submission mock with nice animations ---
  const form = document.getElementById('preventivo-form');
  const submitBtn = form.querySelector('.btn-submit-cmyk');
  const loader = form.querySelector('.btn-loader');
  const feedback = document.getElementById('form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    loader.style.display = 'inline-block';
    submitBtn.querySelector('span').textContent = 'Invio in corso...';
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    const formData = new FormData(form);

    fetch('/send_email.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        feedback.textContent = `Grazie ${document.getElementById('nome').value}! Il tuo preventivo per la stampa di ${document.getElementById('quantita').value} copie è stato inviato con successo. Ti risponderemo entro 24 ore.`;
        feedback.className = 'form-feedback success';
        form.reset();
        fileNameDisplay.textContent = 'Nessun file selezionato';
      } else {
        throw new Error('Server error');
      }
    })
    .catch(error => {
      // Per il test in locale (dove PHP non gira sotto Vite), simuliamo comunque il successo per mostrare come funziona la grafica!
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.')) {
        setTimeout(() => {
          feedback.textContent = `[SIMULAZIONE LOCALE] Grazie ${document.getElementById('nome').value}! La richiesta di preventivo è stata inviata con successo (in produzione invierà una vera email a tipografiaresta@gmail.com).`;
          feedback.className = 'form-feedback success';
          form.reset();
          fileNameDisplay.textContent = 'Nessun file selezionato';
        }, 1500);
      } else {
        feedback.textContent = "Si è verificato un errore durante l'invio della richiesta. Riprova più tardi o scrivici direttamente via email.";
        feedback.className = 'form-feedback error';
      }
    })
    .finally(() => {
      // Reset button state
      submitBtn.disabled = false;
      loader.style.display = 'none';
      submitBtn.querySelector('span').textContent = 'Invia la tua Richiesta';
    });
  });
});
