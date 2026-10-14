'use strict';

/* ---------- Data ---------- */
const ALL = ['TypeScript', 'ReactJs', 'NextJS', 'CSS', 'HTML', 'MongoDB'];
const projects = [
  { title: 'How to make Flyer Design', tags: ALL },
  { title: 'Portfolio Landing Page', tags: ALL.slice(0, 4) },
  { title: 'E-commerce Dashboard', tags: ALL },
  { title: 'Weather App Interface', tags: ALL },
  { title: 'Task Manager Web App', tags: ALL },
  { title: 'Design System Library', tags: ALL },
];
const desc = 'Lorem ipsum dolor sit amet, consec adipiscing elit awd and lorem ipsum...';

const reviews = [
  { title: 'Amazing work!', name: 'Tiana Philips', role: 'Photographer', img: 1 },
  { title: 'Great Quality!', name: 'James Gouse', role: 'Graphic Designer', img: 2 },
  { title: 'Amazing work!', name: 'Tiana Philips', role: 'Photographer', img: 1 },
  { title: 'Great Quality!', name: 'Talan Westervelt', role: 'Business man', img: 3 },
  { title: 'Great Quality!', name: 'James Gouse', role: 'Graphic Designer', img: 2 },
];
const reviewText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae nulla diam in ac dictum a urna viverra morbi. Morbi donec amet....';
const star = '<svg viewBox="0 0 24 22" preserveAspectRatio="none" aria-hidden="true"><path d="M12 0l3.1 7.6L24 8.4l-6.6 5.5L19.5 22 12 17.6 4.5 22l2.1-8.1L0 8.4l8.9-.8z"/></svg>';

/* ---------- Render projects ---------- */
document.getElementById('projectGrid').innerHTML = projects.map((p, i) => `
  <article class="project-card">
    <img src="assets/images/project-${i + 1}.png" alt="Cover image for ${p.title}" width="385" height="256" loading="lazy">
    <div class="card-body">
      <div class="card-text"><h3>${p.title}</h3><p>${desc}</p></div>
      <ul class="tags" aria-label="Tech stack">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>
  </article>`).join('');

/* ---------- Carousel ---------- */
const track = document.getElementById('reviewsTrack');
const dotsWrap = document.getElementById('sliderDots');
const region = track.closest('.reviews');
track.innerHTML = reviews.map((r, i) => `
  <li class="review" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${reviews.length}">
    <div class="stars" role="img" aria-label="5 out of 5 stars">${star.repeat(5)}</div>
    <h3>${r.title}</h3>
    <blockquote>${reviewText}</blockquote>
    <div class="author"><img src="assets/images/avatar-${r.img}.png" alt="Portrait of ${r.name}" width="88" height="81"><div><strong>${r.name}</strong><span>${r.role}</span></div></div>
  </li>`).join('');
dotsWrap.innerHTML = reviews.map((r, i) =>
  `<button class="slider-dot" role="tab" aria-label="Show recommendation ${i + 1}" aria-selected="false"></button>`).join('');

const slides = track.querySelectorAll('.review');
const dots = dotsWrap.querySelectorAll('.slider-dot');
let currentIndex = -1, timer;

const metrics = () => {
  const gap = parseFloat(getComputedStyle(track).columnGap) || 25;
  const step = slides[0].offsetWidth + gap;
  const visible = Math.max(1, Math.floor((region.clientWidth + gap) / step));
  return { step, lead: visible - 1, max: Math.max(0, track.scrollWidth - region.clientWidth) };
};
/* The active dot is the "focus" card, shown as the last fully visible one (design: card 1 at x=98, dot 3 active). */
function updateSlide(index) {
  const { step, lead, max } = metrics();
  currentIndex = (index + slides.length) % slides.length;
  track.style.transform = `translateX(${-Math.min(Math.max(0, currentIndex - lead) * step, max)}px)`;
  dots.forEach((d, i) => { d.classList.toggle('active', i === currentIndex); d.setAttribute('aria-selected', i === currentIndex); });
}
function autoplay() {
  clearInterval(timer);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  timer = setInterval(() => updateSlide(currentIndex + 1), 5000);
}
dots.forEach((dot, i) => dot.addEventListener('click', () => { updateSlide(i); autoplay(); }));
dotsWrap.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { updateSlide(currentIndex + 1); dots[currentIndex].focus(); }
  if (e.key === 'ArrowLeft') { updateSlide(currentIndex - 1); dots[currentIndex].focus(); }
});
region.addEventListener('mouseenter', () => clearInterval(timer));
region.addEventListener('mouseleave', autoplay);
let startX = 0;
region.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
region.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) { updateSlide(currentIndex + (dx < 0 ? 1 : -1)); autoplay(); }
});
window.addEventListener('resize', () => updateSlide(currentIndex));
updateSlide(metrics().lead);
autoplay();

/* ---------- Navigation ---------- */
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
const links = [...document.querySelectorAll('.nav-link')];

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.forEach(l => l.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));

const targets = links.map(l => document.querySelector(l.hash)).filter(Boolean);
const setActive = id => links.forEach(l => {
  const on = l.hash === '#' + id;
  l.classList.toggle('active', on);
  on ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current');
});
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
}, { rootMargin: '-45% 0px -50% 0px' });
targets.forEach(t => io.observe(t));
window.addEventListener('scroll', () => {
  header.classList.toggle('compact', window.scrollY > 80);
  if (window.scrollY < 100) setActive('home');
}, { passive: true });

/* ---------- Contact form ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const rules = {
  fullName: v => v ? '' : 'Please enter your full name.',
  email: v => !v ? 'Please enter your email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email like name@example.com.',
  message: v => v.length === 0 || v.length >= 10 ? '' : 'Your message should be at least 10 characters.',
};
function check(id) {
  const input = form.querySelector('#' + id);
  const msg = rules[id](input.value.trim());
  form.querySelector('#err-' + id).textContent = msg;
  input.setAttribute('aria-invalid', Boolean(msg));
  return !msg;
}
Object.keys(rules).forEach(id => form.querySelector('#' + id).addEventListener('blur', () => check(id)));

form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = '';
  const results = Object.keys(rules).map(check);
  if (results.includes(false)) { form.querySelector('[aria-invalid="true"]').focus(); return; }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Sending...';
  setTimeout(() => {
    form.reset();
    btn.disabled = false; btn.textContent = 'Send message';
    status.textContent = 'Message sent. Thank you for getting in touch.';
  }, 1000);
});
