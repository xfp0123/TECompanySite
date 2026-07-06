/* ── Mobile Menu ─────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── Poster Upload ───────────────────────── */
function bindImageUpload(inputId, previewId, zoneId) {
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const zone    = document.getElementById(zoneId);
  if (!input || !preview || !zone) return;

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.classList.add('show');
      const placeholder = zone.querySelector('.poster__placeholder, p, svg');
      if (zone.id === 'posterZone') {
        zone.querySelector('.poster__placeholder').style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  }

  input.addEventListener('change', e => loadFile(e.target.files[0]));

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    loadFile(e.dataTransfer.files[0]);
  });
}

bindImageUpload('posterInput', 'posterPreview', 'posterZone');
bindImageUpload('qrInput',     'qrPreview',     'qrZone');

/* ── QR preview hide placeholder ────────── */
document.getElementById('qrInput').addEventListener('change', function(e) {
  if (e.target.files[0]) {
    const qrBox = document.getElementById('qrZone');
    qrBox.querySelectorAll('svg, p').forEach(el => el.style.display = 'none');
  }
});

/* ── Counter Animation ───────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step     = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const statsBar = document.querySelector('.stats-bar');
let animated   = false;

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !animated) {
    animated = true;
    document.querySelectorAll('.stat__num').forEach(animateCounter);
  }
}, { threshold: 0.3 });

if (statsBar) observer.observe(statsBar);

/* ── Scroll Reveal ───────────────────────── */
const revealEls = document.querySelectorAll(
  '.about__card, .service-card, .contact__item'
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  revealObserver.observe(el);
});

/* ── Contact Form (Formspree) ────────────── */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  btn.textContent = '发送中…';
  btn.disabled    = true;

  fetch('https://formspree.io/f/mvzjlngl', {
    method: 'POST',
    body: new FormData(this),
    headers: { 'Accept': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      success.classList.add('show');
      this.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert('发送失败，请稍后重试或直接发送邮件至 xfp0123@gmail.com');
    }
  })
  .catch(() => {
    alert('网络错误，请稍后重试或直接发送邮件至 xfp0123@gmail.com');
  })
  .finally(() => {
    btn.textContent = '发送消息';
    btn.disabled    = false;
  });
});
