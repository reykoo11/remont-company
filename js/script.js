"use strict";

const SERVICES = [
  { icon: "ph-paint-roller", title: "Косметический ремонт", desc: "Обновление стен, потолков, полов без переноса коммуникаций.", price: "от 2 500 ₽/м²" },
  { icon: "ph-hammer", title: "Капитальный ремонт", desc: "Полная перепланировка, замена коммуникаций, стяжка, штукатурка.", price: "от 6 000 ₽/м²" },
  { icon: "ph-lightning", title: "Электрика", desc: "Разводка проводки, установка щитков, розеток и освещения.", price: "от 900 ₽/точка" },
  { icon: "ph-drop", title: "Сантехника", desc: "Монтаж труб, установка сантехники, разводка водоснабжения.", price: "от 1 200 ₽/точка" },
];

const PROJECTS = [
  { title: "Косметический ремонт, 54 м²", desc: "Однокомнатная квартира — обновление за 12 дней.", price: "≈ 320 000 ₽", image: "assets/portfolio-kitchen.jpg" },
  { title: "Капитальный ремонт, 72 м²", desc: "Полная перепланировка двухкомнатной квартиры.", price: "≈ 890 000 ₽", image: "assets/portfolio-bathroom.jpg" },
  { title: "Отделка дома, 140 м²", desc: "Загородный дом — чистовая отделка под ключ.", price: "≈ 1 450 000 ₽", image: "assets/portfolio-bedroom.jpg" },
];

const REVIEWS = [
  { text: "Сделали ремонт кухни за 2 недели, всё аккуратно и в срок. Смету не меняли.", author: "Анна К." },
  { text: "Капитальный ремонт квартиры прошёл без единого сюрприза по бюджету.", author: "Дмитрий С." },
  { text: "Электрику и сантехнику поменяли за 3 дня. Мастера вежливые и чистоплотные.", author: "Ирина В." },
];

const PRICE_TABLE = {
  cosmetic: 2500,
  capital: 6000,
  electric: 1800,
  plumbing: 1600,
  finishing: 3200,
};

function renderList(containerId, items, render) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map((item, i) => render(item, i)).join("");
}

function renderServices() {
  renderList("servicesGrid", SERVICES, (s, i) => `
    <div class="card reveal" role="listitem" style="--reveal-delay:${i * 0.08}s">
      <span class="card__icon"><i class="ph ${s.icon}" aria-hidden="true"></i></span>
      <h3 class="card__title">${s.title}</h3>
      <p class="card__desc">${s.desc}</p>
      <span class="card__price">${s.price}</span>
    </div>`);
}

function renderProjects() {
  renderList("portfolioGrid", PROJECTS, (p, i) => `
    <article class="project-card reveal" role="listitem" style="--reveal-delay:${i * 0.1}s">
      <div class="before-after">
        <div class="before-after__side before-after__side--before" style="background-image:url('${p.image}')"><span>До</span></div>
        <div class="before-after__side before-after__side--after" style="background-image:url('${p.image}')"><span>После</span></div>
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.desc}</p>
        <span class="card__price">${p.price}</span>
      </div>
    </article>`);
}

function renderReviews() {
  renderList("reviewsGrid", REVIEWS, (r, i) => `
    <div class="review-card reveal" role="listitem" style="--reveal-delay:${i * 0.08}s">
      <div class="review-card__stars">★★★★★</div>
      <p class="review-card__text">${r.text}</p>
      <p class="review-card__author">${r.author}</p>
    </div>`);
}

function initCalculator() {
  const typeSelect = document.getElementById("calcType");
  const areaInput = document.getElementById("calcArea");
  const areaValue = document.getElementById("calcAreaValue");
  const result = document.getElementById("calcResult");
  if (!typeSelect || !areaInput || !result) return;

  const format = (n) => new Intl.NumberFormat("ru-RU").format(n);

  const update = () => {
    const area = Number(areaInput.value);
    const rate = PRICE_TABLE[typeSelect.value] || 2500;
    const total = area * rate;
    areaValue.textContent = `${area} м²`;
    result.textContent = `от ${format(total)} ₽`;
  };

  typeSelect.addEventListener("change", update);
  areaInput.addEventListener("input", update);
  update();
}

function initRevealObserver() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => observer.observe(el));
}

function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav__link");
  const linkFor = (id) => document.querySelector(`.nav__link[href="#${id}"]`);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (link && entry.isIntersecting) {
        links.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (!menuToggle || !nav) return;
  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll(".nav__link").forEach((l) => l.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initForm() {
  const form = document.getElementById("requestForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  const fields = {
    name: { input: document.getElementById("name"), error: document.getElementById("nameError") },
    phone: { input: document.getElementById("phone"), error: document.getElementById("phoneError") },
  };
  const setError = (key, msg) => {
    const { input, error } = fields[key];
    input.closest(".form-field").classList.toggle("has-error", Boolean(msg));
    error.textContent = msg || "";
  };
  const validate = () => {
    let valid = true;
    if (!fields.name.input.value.trim()) { setError("name", "Укажите имя."); valid = false; } else setError("name", "");
    const phonePattern = /^[+\d][\d\s()-]{6,}$/;
    if (!phonePattern.test(fields.phone.input.value.trim())) { setError("phone", "Укажите корректный телефон."); valid = false; } else setError("phone", "");
    return valid;
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) { status.textContent = ""; return; }
    status.textContent = "Заявка отправлена! Мы перезвоним в выбранное время.";
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderServices();
  renderProjects();
  renderReviews();
  initCalculator();
  initHeaderScroll();
  initActiveNav();
  initMobileMenu();
  initBackToTop();
  initForm();
  initRevealObserver();
});
