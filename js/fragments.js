(function () {
  const grid = document.getElementById("fragGrid");
  const cards = Array.from(grid.querySelectorAll(".frag-card"));
  const chips = Array.from(document.querySelectorAll(".chip[data-filter]"));

  const modal = document.getElementById("fragModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalSub = document.getElementById("modalSub");
  const modalBody = document.getElementById("modalBody");

  const shuffleBtn = document.getElementById("shuffleBtn");
  const revealBtn = document.getElementById("revealBtn");
  const sortNewestBtn = document.getElementById("sortNewestBtn");
  const sortOldestBtn = document.getElementById("sortOldestBtn");

  let activeFilter = "all";

  function setActiveChip(filter) {
    chips.forEach(c => c.classList.toggle("is-active", c.dataset.filter === filter));
  }

  function applyFilter(filter) {
    activeFilter = filter;
    setActiveChip(filter);

    cards.forEach(card => {
      const type = card.dataset.type;
      const isHidden = card.dataset.hidden === "true";
      const shouldShowByType = filter === "all" || type === filter;

      if (isHidden) return;

      card.style.display = shouldShowByType ? "" : "none";
    });
  }

  function getVisibleCards() {
    return cards.filter(card =>
      card.style.display !== "none" &&
      card.dataset.hidden !== "true"
    );
  }

  function shuffleVisible() {
    const visible = getVisibleCards();

    for (let i = visible.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [visible[i], visible[j]] = [visible[j], visible[i]];
    }

    visible.forEach(card => grid.appendChild(card));
  }

  function sortVisible(order) {
    const visible = getVisibleCards();

    visible.sort((a, b) => {
      const dateA = new Date(a.dataset.date || "1900-01-01");
      const dateB = new Date(b.dataset.date || "1900-01-01");

      if (order === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    visible.forEach(card => grid.appendChild(card));
  }

  function revealOneHidden() {
    const hidden = cards.filter(c => c.dataset.hidden === "true");

    if (!hidden.length) {
      if (revealBtn) {
        revealBtn.textContent = "Nothing left to reveal";
        revealBtn.disabled = true;
      }
      return;
    }

    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    pick.dataset.hidden = "false";
    pick.classList.remove("is-hidden");

    const type = pick.dataset.type;
    const shouldShow = activeFilter === "all" || activeFilter === type;
    pick.style.display = shouldShow ? "" : "none";
  }

  function openModal(payload) {
    modalTitle.textContent = payload.title || "";
    modalSub.textContent = payload.sub || "";
    modalBody.innerHTML = "";

    if (payload.kind === "image") {
      const img = document.createElement("img");
      img.src = payload.href;
      img.alt = payload.title || "Fragment";
      modalBody.appendChild(img);
    } else {
      const div = document.createElement("div");
      div.className = "modal-text";
      div.textContent = payload.text || "";
      modalBody.appendChild(div);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => applyFilter(chip.dataset.filter));
  });

  grid.addEventListener("click", (e) => {
    const opener = e.target.closest(".frag-open");
    if (!opener) return;

    const kind = opener.dataset.kind;
    const title = opener.dataset.title;
    const sub = opener.dataset.sub;

    if (kind === "image") {
      if (opener.tagName.toLowerCase() === "a") e.preventDefault();
      openModal({ kind, title, sub, href: opener.getAttribute("href") });
    } else {
      openModal({ kind, title, sub, text: opener.dataset.text });
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target.dataset.close === "true") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  shuffleBtn?.addEventListener("click", shuffleVisible);
  revealBtn?.addEventListener("click", revealOneHidden);
  sortNewestBtn?.addEventListener("click", () => sortVisible("newest"));
  sortOldestBtn?.addEventListener("click", () => sortVisible("oldest"));

  applyFilter("all");
  shuffleVisible();
})();