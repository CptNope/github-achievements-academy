// Progress tracking and quizzes for the lesson pages.
// Progress lives only in this browser (localStorage). Nothing is sent anywhere.
(() => {
  const KEY = "gaa-progress-v1";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { done: {}, quiz: {} }; } catch { return { done: {}, quiz: {} }; } };
  const write = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked: progress lasts this visit */ } };
  let state = read();
  const page = document.body.dataset.page;

  // ----- done markers everywhere a lesson is linked -----
  function paint() {
    document.querySelectorAll("a[data-page]").forEach((a) => {
      const done = !!state.done[a.dataset.page];
      a.classList.toggle("is-done", done);
      let sr = a.querySelector(".done-sr");
      if (done && !sr) { sr = document.createElement("span"); sr.className = "vh done-sr"; sr.textContent = " (done)"; a.appendChild(sr); }
      if (!done && sr) sr.remove();
    });
    document.querySelectorAll("[data-track-progress]").forEach((el) => {
      const links = document.querySelectorAll(`a[data-track="${CSS.escape(el.dataset.trackProgress)}"][data-lesson]`);
      const total = links.length; const n = [...links].filter((a) => state.done[a.dataset.page]).length;
      el.textContent = !total ? "" : n === 0 ? `Not started · ${total} to go` : `${n} of ${total} done`;
      el.parentElement.classList.toggle("zero", n === 0);
      const bar = el.parentElement.querySelector(".bar-fill"); if (bar) bar.style.width = total ? (n / total) * 100 + "%" : "0";
    });
    const btn = document.getElementById("mark-done");
    if (btn) {
      const done = !!state.done[page];
      btn.textContent = done ? "Completed. Mark as not done" : "Mark this lesson complete";
      btn.setAttribute("aria-pressed", String(done));
      btn.classList.toggle("is-on", done);
    }
  }

  function setDone(p, v) { state = read(); if (v) state.done[p] = Date.now(); else delete state.done[p]; write(state); paint(); }

  document.getElementById("mark-done")?.addEventListener("click", () => setDone(page, !read().done[page]));

  // ----- quiz -----
  const form = document.getElementById("quiz-form");
  if (form) {
    form.classList.add("js");
    const result = document.getElementById("quiz-result");
    const prev = read().quiz[page];
    if (prev !== undefined) result.textContent = `Your best score so far: ${prev} of ${form.querySelectorAll("fieldset").length}.`;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const sets = [...form.querySelectorAll("fieldset")];
      let right = 0, answered = 0;
      sets.forEach((fs) => {
        const pick = fs.querySelector("input:checked");
        const ok = pick && pick.value === fs.dataset.answer;
        if (pick) answered++;
        if (ok) right++;
        fs.classList.toggle("right", !!ok);
        fs.classList.toggle("wrong", !!pick && !ok);
        fs.querySelector(".why").hidden = !pick;
        fs.querySelector(".verdict").textContent = !pick ? "" : ok ? "Correct." : "Not quite.";
      });
      if (answered < sets.length) { result.textContent = `Answer all ${sets.length} questions, then check again.`; return; }
      state = read();
      state.quiz[page] = Math.max(state.quiz[page] || 0, right);
      write(state);
      if (right === sets.length) { result.textContent = `${right} of ${sets.length}: perfect. Lesson marked complete.`; setDone(page, true); }
      else result.textContent = `${right} of ${sets.length}. Read the explanations, then try again.`;
      result.focus();
    });
    form.addEventListener("reset", () => setTimeout(() => {
      form.querySelectorAll("fieldset").forEach((fs) => { fs.classList.remove("right", "wrong"); fs.querySelector(".why").hidden = true; fs.querySelector(".verdict").textContent = ""; });
      result.textContent = "";
    }));
  }

  // ----- reset all progress (two-step, no browser dialog) -----
  const reset = document.getElementById("reset-progress");
  if (reset) {
    let armed = false;
    reset.addEventListener("click", () => {
      if (!armed) { armed = true; reset.textContent = "Click again to erase your progress"; setTimeout(() => { armed = false; reset.textContent = "Reset my progress"; }, 4000); return; }
      try { localStorage.removeItem(KEY); localStorage.removeItem("gaa-sandbox-v1"); } catch { /* ignore */ }
      state = { done: {}, quiz: {} }; armed = false; reset.textContent = "Progress erased"; paint();
    });
  }

  paint();

  // ----- gentle entrances (skipped entirely for reduced motion) -----
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const sel = [".lesson > h1", ".jump", ".prose > h2", ".prose > pre", ".prose > .table", ".prose > blockquote", ".quiz", ".complete", ".pager a",
      ".index-hero > div > *", ".track-map li", ".track-head", ".track-list li"].join(",");
    const els = [...document.querySelectorAll(sel)];
    const groups = new Map();
    els.forEach((el) => { const k = el.parentElement; const i = groups.get(k) || 0; groups.set(k, i + 1); el.style.setProperty("--i", Math.min(i, 6)); el.classList.add("rv"); });
    document.documentElement.classList.add("anim");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }
})();
