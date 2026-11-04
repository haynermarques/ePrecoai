const revealedElements = document.querySelectorAll(".reveal");

const menuToggle = document.querySelector(".menu-toggle");
const topbar = document.querySelector(".topbar");

menuToggle?.addEventListener("click", () => {
  const isOpen = topbar.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    topbar?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealedElements.forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  const limit = 7;

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const percentX = (event.clientX - rect.left) / rect.width - 0.5;
    const percentY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = percentX * limit;
    const rotateX = percentY * -limit;

    card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll("form[data-wa]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const linhas = [form.dataset.msg, ""];
    form.querySelectorAll("input[name], select[name]").forEach((campo) => {
      const valor = campo.value.trim();
      const rotulo = campo.closest("label")?.dataset.l || campo.name;
      if (valor) linhas.push(`${rotulo}: ${valor}`);
    });
    window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
    const thanks = form.querySelector(".form-thanks");
    if (thanks) thanks.hidden = false;
  });
});

document.querySelectorAll(".interest").forEach((box) => {
  const cards = [...box.querySelectorAll(".interest-card")];
  const parts = cards.filter((c) => c.dataset.key !== "all");
  const all = box.querySelector('[data-key="all"]');
  const status = box.querySelector(".interest-status");
  const cta = box.querySelector(".interest-cta");
  const selected = (list) => list.filter((c) => c.getAttribute("aria-pressed") === "true");
  const set = (card, on) => card.setAttribute("aria-pressed", String(on));

  const lista = (nomes) => (nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}` : nomes[0]);

  const refresh = (hint) => {
    const sel = selected(parts);
    const full = sel.length === parts.length;
    set(all, full);
    if (!sel.length) {
      status.hidden = true;
      cta.textContent = "Fale conosco";
      cta.href = `https://wa.me/${box.dataset.wa}?text=${encodeURIComponent("Olá, quero conhecer o ecossistema PreçoAI.")}`;
      return;
    }
    status.hidden = false;
    status.innerHTML = `${hint ? `<span class="interest-hint">${hint}</span>` : ""}<span>Você escolheu: <strong>${lista(sel.map((c) => c.dataset.label))}</strong></span>`;
    cta.textContent = full ? "Falar sobre o ecossistema completo" : `Falar sobre ${lista(sel.map((c) => c.dataset.short))}`;
    const linhas = ["Olá! Vim pelo site do PreçoAI e tenho interesse em:", ...sel.map((c) => `• ${c.dataset.label}`)];
    cta.href = `https://wa.me/${box.dataset.wa}?text=${encodeURIComponent(linhas.join("\n"))}`;
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const on = card.getAttribute("aria-pressed") !== "true";
      if (card === all) parts.forEach((c) => set(c, on));
      else set(card, on);
      refresh(on ? card.dataset.hint : "");
    });
  });
});
