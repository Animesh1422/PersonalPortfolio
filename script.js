"use strict";
const EMAIL = "animesh3736@gmail.com";
const $ = id => document.getElementById(id);

function showToast(msg) {
  const t = $("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast.id);
  showToast.id = setTimeout(() => t.classList.remove("show"), 2600);
}

// Footer year.
if ($("currentYear")) $("currentYear").textContent = new Date().getFullYear();

// Theme: shared between both pages in this browser.
const themeToggle = $("themeToggle");
function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  if (!themeToggle) return;
  themeToggle.textContent = dark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
}
applyTheme(document.documentElement.getAttribute("data-theme") === "dark");
if (themeToggle) themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-theme") !== "dark";
  applyTheme(dark);
  try { localStorage.setItem("animesh-theme", dark ? "dark" : "light"); } catch (e) {}
});

// Mobile menu.
const menuToggle = $("menuToggle"), navLinks = $("navLinks");
function closeMenu() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "✕" : "☰";
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) { closeMenu(); menuToggle.focus(); }
  });
}

// Add Skill: saved in this browser only.
const skillsGrid = $("skillsGrid"), skillForm = $("skillForm"), skillName = $("skillName"), skillCategory = $("skillCategory");
const SKILL_KEY = "animesh-portfolio-custom-skills";
function savedSkills() {
  try { const v = JSON.parse(localStorage.getItem(SKILL_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}
function storeSkills(list) { try { localStorage.setItem(SKILL_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }
function renderSkills() {
  if (!skillsGrid) return;
  skillsGrid.querySelectorAll("[data-custom]").forEach(n => n.remove());
  savedSkills().forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "skill-card"; card.dataset.custom = "1";
    const icon = document.createElement("span"); icon.className = "skill-icon"; icon.textContent = s.name.trim().slice(0, 2).toUpperCase();
    const box = document.createElement("div");
    const n = document.createElement("strong"); n.textContent = s.name;
    const c = document.createElement("small"); c.textContent = s.category;
    box.append(n, c);
    const rm = document.createElement("button");
    rm.type = "button"; rm.className = "remove-skill"; rm.textContent = "×";
    rm.setAttribute("aria-label", "Remove " + s.name); rm.title = "Remove skill";
    rm.addEventListener("click", () => { const l = savedSkills(); l.splice(i, 1); storeSkills(l); renderSkills(); });
    card.append(icon, box, rm);
    skillsGrid.append(card);
  });
}
if (skillForm && skillName && skillCategory) {
  $("openSkillForm").addEventListener("click", () => { skillForm.hidden = !skillForm.hidden; if (!skillForm.hidden) skillName.focus(); });
  $("cancelSkillForm").addEventListener("click", () => { skillForm.reset(); skillForm.hidden = true; });
  skillForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = skillName.value.trim();
    if (!name) return;
    const list = savedSkills();
    const builtIn = [...skillsGrid.querySelectorAll(".skill-card:not([data-custom]) strong")].map(x => x.textContent.toLowerCase());
    if (list.some(s => s.name.toLowerCase() === name.toLowerCase()) || builtIn.includes(name.toLowerCase())) {
      skillName.setCustomValidity("This skill is already on the page.");
      skillName.reportValidity();
      skillName.setCustomValidity("");
      return;
    }
    list.push({ name, category: skillCategory.value });
    if (!storeSkills(list)) { showToast("Your browser could not save this skill."); return; }
    renderSkills(); skillForm.reset(); skillForm.hidden = true;
  });
  renderSkills();
}

// Case studies (projects page).
const caseStudies = {
  excel: {
    title: "Excel Analysis Exercise", category: "Excel · Self practice", visual: "v-sheet", label: "Excel · Self practice",
    summary: "A practice exercise on matching orders to departments and checking the result.",
    problem: "Each of 40 orders had to be matched to a department, and any order ID without a match had to be easy to spot.",
    solution: "XLOOKUP mapped departments to the orders and showed \"Not found\" for IDs that did not match. SUMIF then totalled sales by department and COUNTIF counted the unmatched orders.",
    tools: ["Excel", "XLOOKUP", "SUMIF", "COUNTIF"],
    contribution: "Self-practice exercise, done on my own."
  },
  shopsphere: {
    title: "ShopSphere", category: "E-commerce · Team project", visual: "v-app", label: "Team project",
    summary: "An e-commerce web application built by a college team on the MERN stack, Aug 2025 – Nov 2025.",
    problem: "Shoppers need to browse products, narrow them down by category, keep items in a cart and check out.",
    solution: "A web application with product listing, category filtering, a cart and a multi-step checkout flow.",
    tools: ["MERN stack", "React", "Tailwind CSS", "Context API"],
    contribution: "Frontend role. I built the product listing, category filtering and multi-step checkout flow in React and Tailwind CSS, and the cart using Context API and a reducer."
  },
  sales: {
    title: "Sales Analysis Dashboard", category: "Excel · Self practice", visual: "v-dash", label: "Excel · Self practice",
    summary: "An interactive Excel dashboard built on a 25-order sample sales dataset (Jan to Mar 2026).",
    problem: "Raw order rows do not show which products, regions or months drive sales and profit.",
    solution: "I put the orders in an Excel Table with calculated sales, cost and profit columns, summarised them with Pivot Tables and built a dashboard: KPI cards for total sales, profit, average order value, quantity and orders, five charts (sales and profit by product, sales by region, category share, monthly sales and profit trend) and Region and Category slicers. Findings: Laptops gave about 63% of sales, Electronics about 92%, North was the top region and the overall profit margin was about 23%.",
    tools: ["Excel", "Pivot Tables", "Charts", "Slicers"],
    contribution: "Self-practice project, built on my own."
  }
};
const mockups = {
  "v-sheet": '<div class="mock-sheet"><div class="ms-bar"></div><div class="ms-grid"><i></i><i></i><i></i><i></i><i></i><i></i><i class="bad"></i><i class="bad"></i><i class="bad"></i><i></i><i></i><i></i></div></div>',
  "v-app": '<div class="mock-app"><div class="mock-sidebar"></div><div class="mock-content"><b>ShopSphere</b><span></span><span></span><i></i></div></div>',
  "v-dash": '<div class="mock-dash"><div class="dt"></div><div class="dr"><i></i><i></i><i></i></div><div class="dc"></div></div>'
};
const caseModal = $("caseModal");
function closeModal() { if (caseModal.close) caseModal.close(); else caseModal.removeAttribute("open"); }
function openCase(key) {
  const c = caseStudies[key];
  if (!c || !caseModal) return;
  $("caseTitle").textContent = c.title;
  $("caseCategory").textContent = c.category;
  $("caseSummary").textContent = c.summary;
  $("caseProblem").textContent = c.problem;
  $("caseSolution").textContent = c.solution;
  $("caseContribution").textContent = c.contribution;
  const tech = $("caseTech"); tech.replaceChildren();
  c.tools.forEach(t => { const s = document.createElement("span"); s.textContent = t; tech.append(s); });
  const vis = $("caseVisual"); vis.replaceChildren();
  const art = document.createElement("div"); art.className = "project-visual " + c.visual;
  const badge = document.createElement("span"); badge.className = "visual-label"; badge.textContent = c.label;
  art.append(badge); art.insertAdjacentHTML("beforeend", mockups[c.visual] || ""); vis.append(art);
  if (typeof caseModal.showModal === "function") caseModal.showModal(); else caseModal.setAttribute("open", "");
}
if (caseModal) {
  document.querySelectorAll(".case-trigger").forEach(b => b.addEventListener("click", () => openCase(b.dataset.project)));
  $("closeCaseModal").addEventListener("click", closeModal);
  caseModal.addEventListener("click", e => { if (e.target === caseModal) closeModal(); });
}

// Contact form: opens the visitor's email app.
const contactForm = $("contactForm");
if (contactForm) contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const v = id => $(id).value.trim();
  const err = $("contactError");
  if (!v("contactName") || !v("contactMessage")) { err.textContent = "Please enter your name and a message."; return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("contactEmail"))) { err.textContent = "Please enter a valid email address."; return; }
  err.textContent = "";
  const subject = encodeURIComponent("Portfolio message from " + v("contactName"));
  const body = encodeURIComponent("Name: " + v("contactName") + "\nEmail: " + v("contactEmail") + "\n\n" + v("contactMessage"));
  window.location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
});

// Copy email.
const copyBtn = $("copyEmail");
if (copyBtn) copyBtn.addEventListener("click", () => {
  const done = () => showToast("Email copied: " + EMAIL);
  if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, () => showToast(EMAIL));
  else showToast(EMAIL);
});

// Highlight the nav link for the section being read (home page).
const spyIds = ["about", "skills", "services", "featured", "education", "contact"];
const spy = spyIds.map($).filter(Boolean);
if (spy.length && navLinks) {
  const hrefFor = id => (id === "featured" ? "projects.html" : "#" + id);
  const update = () => {
    let cur = null;
    spy.forEach(s => { if (s.getBoundingClientRect().top <= 140) cur = s.id; });
    navLinks.querySelectorAll(":scope > a").forEach(a => {
      const h = a.getAttribute("href");
      a.classList.toggle("active", cur ? h === hrefFor(cur) : h === "index.html");
    });
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Back to top.
const backTop = $("backTop");
if (backTop) {
  window.addEventListener("scroll", () => { backTop.hidden = window.scrollY < 600; }, { passive: true });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Typing effect (static text when reduced motion is on).
(function () {
  const el = $("typedRole");
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const roles = ["Business Analyst", "Data Analyst", "Advanced Excel User", "SQL Learner"];
  let r = 0, i = roles[0].length, deleting = true;
  (function tick() {
    const word = roles[r];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 85;
    if (!deleting && i === word.length) { deleting = true; delay = 1400; }
    else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  })();
})();

// Scroll reveal (content stays visible if JS or IntersectionObserver is missing).
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const targets = document.querySelectorAll(".section-block, .project-card, .achievement");
  document.body.classList.add("reveal-ready");
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  targets.forEach(t => { t.classList.add("reveal-on-scroll"); io.observe(t); });
}
