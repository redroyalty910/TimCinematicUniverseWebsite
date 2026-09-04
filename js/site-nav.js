(function () {
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  function setOpen(dropdown, open) {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");

    dropdown.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");

    toggle.addEventListener("click", event => {
      event.stopPropagation();

      const isOpen =
        dropdown.classList.contains("is-open");

      dropdowns.forEach(item => {
        setOpen(item, false);
      });

      setOpen(dropdown, !isOpen);
    });

    dropdown.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setOpen(dropdown, false);
        toggle.focus();
      }
    });
  });

  document.addEventListener("click", event => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target)) {
        setOpen(dropdown, false);
      }
    });
  });
})();