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
