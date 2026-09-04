(function () {
  const grid = document.getElementById("fragGrid");
  const cards = Array.from(grid.querySelectorAll(".frag-card"));

  const typeChips = Array.from(
    document.querySelectorAll(".chip[data-filter]")
  );

  const creatorChips = Array.from(
    document.querySelectorAll(".chip[data-creator-filter]")
  );

  const modal = document.getElementById("fragModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalSub = document.getElementById("modalSub");
  const modalBody = document.getElementById("modalBody");

  const shuffleBtn = document.getElementById("shuffleBtn");
  const revealBtn = document.getElementById("revealBtn");
  const sortNewestBtn = document.getElementById("sortNewestBtn");
  const sortOldestBtn = document.getElementById("sortOldestBtn");

  const orderChips = [
    shuffleBtn,
    sortNewestBtn,
    sortOldestBtn
  ].filter(Boolean);

  let activeType = "all";
  let activeCreator = "all";

  function setActiveTypeChip(filter) {
    typeChips.forEach(chip => {
      chip.classList.toggle(
        "is-active",
        chip.dataset.filter === filter
      );
    });
  }

  function setActiveCreatorChip(creator) {
    creatorChips.forEach(chip => {
      chip.classList.toggle(
        "is-active",
        chip.dataset.creatorFilter === creator
      );
    });
  }

  function setActiveOrderChip(activeButton) {
    orderChips.forEach(chip => {
      chip.classList.toggle(
        "is-active",
        chip === activeButton
      );
    });
  }

  function cardMatchesFilters(card) {
    const type = card.dataset.type || "";
    const creator = card.dataset.creator || "";
    const isHidden = card.dataset.hidden === "true";

    if (isHidden) {
      return false;
    }

    const typeMatches =
      activeType === "all" ||
      type === activeType;

    const creatorMatches =
      activeCreator === "all" ||
      creator === activeCreator;

    return typeMatches && creatorMatches;
  }

  function applyFilters() {
    cards.forEach(card => {
      card.style.display =
        cardMatchesFilters(card)
          ? ""
          : "none";
    });
  }

  function setTypeFilter(filter) {
    activeType = filter;
    setActiveTypeChip(filter);
    applyFilters();
  }

  function setCreatorFilter(creator) {
    activeCreator = creator;
    setActiveCreatorChip(creator);
    applyFilters();
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
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [visible[i], visible[j]] =
        [visible[j], visible[i]];
    }

    visible.forEach(card => {
      grid.appendChild(card);
    });
  }

  function getCardDate(card) {
    const rawDate = card.dataset.date;

    if (!rawDate) {
      return new Date(0);
    }

    const parsedDate = new Date(
      `${rawDate}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return new Date(0);
    }

    return parsedDate;
  }

  function sortVisible(order) {
    const visible = getVisibleCards();

    visible.sort((a, b) => {
      const dateA = getCardDate(a);
      const dateB = getCardDate(b);

      if (order === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    visible.forEach(card => {
      grid.appendChild(card);
    });
  }

  function revealOneHidden() {
    const hidden = cards.filter(
      card => card.dataset.hidden === "true"
    );

    if (!hidden.length) {
      if (revealBtn) {
        revealBtn.textContent =
          "Nothing left to reveal";

        revealBtn.disabled = true;
      }

      return;
    }

    const randomIndex = Math.floor(
      Math.random() * hidden.length
    );

    const pickedCard = hidden[randomIndex];

    pickedCard.dataset.hidden = "false";
    pickedCard.classList.remove("is-hidden");

    applyFilters();
  }

  function openModal(payload) {
    modalTitle.textContent =
      payload.title || "";

    modalSub.textContent =
      payload.sub || "";

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

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";
  }

  typeChips.forEach(chip => {
    chip.addEventListener("click", () => {
      setTypeFilter(
        chip.dataset.filter
      );
    });
  });

  creatorChips.forEach(chip => {
    chip.addEventListener("click", () => {
      setCreatorFilter(
        chip.dataset.creatorFilter
      );
    });
  });

  grid.addEventListener("click", event => {
    const opener =
      event.target.closest(".frag-open");

    if (!opener) {
      return;
    }

    const kind = opener.dataset.kind;
    const title = opener.dataset.title;
    const sub = opener.dataset.sub;

    if (kind === "image") {
      if (
        opener.tagName.toLowerCase() === "a"
      ) {
        event.preventDefault();
      }

      openModal({
        kind,
        title,
        sub,
        href: opener.getAttribute("href")
      });

      return;
    }

    if (kind === "text") {
      openModal({
        kind,
        title,
        sub,
        text: opener.dataset.text
      });
    }
  });

  modal.addEventListener("click", event => {
    if (
      event.target.dataset.close === "true"
    ) {
      closeModal();
    }
  });

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        modal.classList.contains("is-open")
      ) {
        closeModal();
      }
    }
  );

  shuffleBtn?.addEventListener(
    "click",
    () => {
      shuffleVisible();
      setActiveOrderChip(shuffleBtn);
    }
  );

  revealBtn?.addEventListener(
    "click",
    revealOneHidden
  );

  sortNewestBtn?.addEventListener(
    "click",
    () => {
      sortVisible("newest");
      setActiveOrderChip(sortNewestBtn);
    }
  );

  sortOldestBtn?.addEventListener(
    "click",
    () => {
      sortVisible("oldest");
      setActiveOrderChip(sortOldestBtn);
    }
  );

  setActiveTypeChip("all");
  setActiveCreatorChip("all");
  setActiveOrderChip(shuffleBtn);

  applyFilters();
  shuffleVisible();
})();