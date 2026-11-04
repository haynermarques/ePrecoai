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

// origem do lead, lida do link da campanha (?utm_source=instagram | facebook | whatsapp)
const origemDoLead = () => {
  const p = new URLSearchParams(window.location.search);
  const fonte = (p.get("utm_source") || p.get("origem") || "").toLowerCase();
  const frases = {
    instagram: "Vim pelo Instagram.",
    ig: "Vim pelo Instagram.",
    facebook: "Vim pelo Facebook.",
    fb: "Vim pelo Facebook.",
    whatsapp: "Vim por um link no WhatsApp.",
    wa: "Vim por um link no WhatsApp.",
  };
  return frases[fonte] || "";
};

document.querySelectorAll("[data-wa-msg]").forEach((a) => {
  const monta = () => {
    const origem = origemDoLead();
    const texto = [a.dataset.waMsg, origem].filter(Boolean).join("\n");
    a.href = `https://wa.me/${a.dataset.waNum}?text=${encodeURIComponent(texto)}`;
  };
  monta();
  a.addEventListener("click", monta);
});

document.querySelectorAll(".interest").forEach((box) => {
  const cards = [...box.querySelectorAll(".interest-card")];
  const parts = cards.filter((c) => c.dataset.key !== "all");
  const all = box.querySelector('[data-key="all"]');
  const status = box.querySelector(".interest-status");
  const cta = box.querySelector(".interest-cta");
  const input = (card) => card.querySelector("input");
  const isOn = (card) => input(card).checked;
  const setOn = (card, on) => {
    input(card).checked = on;
    card.classList.toggle("is-on", on);
  };
  const lista = (nomes) => (nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}` : nomes[0] || "");

  const link = () => {
    const sel = parts.filter(isOn);
    const intro = box.dataset.intro || "Olá! Vim pelo site do PreçoAI e tenho interesse em:";
    const padrao = box.dataset.padrao || "Olá, quero conhecer o ecossistema PreçoAI.";
    const origem = box.hasAttribute("data-origem") ? origemDoLead() : "";
    const linhas = sel.length ? [intro, ...sel.map((c) => `• ${c.dataset.label}`)] : [padrao];
    if (origem) linhas.push("", origem);
    const texto = linhas.join("\n");
    return `https://wa.me/${box.dataset.wa}?text=${encodeURIComponent(texto)}`;
  };

  const refresh = (hint) => {
    const sel = parts.filter(isOn);
    const full = sel.length === parts.length;
    setOn(all, full);
    status.hidden = !sel.length;
    if (sel.length) {
      status.innerHTML = `${hint ? `<span class="interest-hint">${hint}</span>` : ""}<span>Você escolheu: <strong>${lista(sel.map((c) => c.dataset.label))}</strong></span>`;
    }
    cta.textContent = !sel.length ? "Quero conhecer mais" : full ? "Quero conhecer o ecossistema completo" : `Quero conhecer ${lista(sel.map((c) => c.dataset.short))}`;
    cta.href = link();
  };

  cards.forEach((card) => {
    input(card).addEventListener("change", () => {
      const on = isOn(card);
      if (card === all) parts.forEach((c) => setOn(c, on));
      setOn(card, on);
      refresh(on ? card.dataset.hint : "");
    });
  });

  cta.href = link();

  // garante a mensagem certa no instante do clique, mesmo que algo tenha mudado
  cta.addEventListener("click", () => {
    cta.href = link();
  });
});
