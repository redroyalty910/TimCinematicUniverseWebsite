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

const siteNavToggle = document.getElementById("siteNavToggle");
const siteNav = document.getElementById("siteNav");

if (siteNavToggle && siteNav) {
  function setMobileNav(open) {
    siteNav.classList.toggle("is-open", open);
    document.body.classList.toggle("mobile-nav-open", open);

    siteNavToggle.setAttribute("aria-expanded", String(open));
    siteNavToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );

    siteNavToggle.textContent = open ? "X" : "☰";
  }

  siteNavToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("is-open");
    setMobileNav(!isOpen);
  });

  siteNav.addEventListener("click", event => {
    if (
      event.target.matches("a") &&
      !event.target.closest(".nav-dropdown-menu")
    ) {
      setMobileNav(false);
    }
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      siteNav.classList.contains("is-open")
    ) {
      setMobileNav(false);
      siteNavToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      setMobileNav(false);
    }
  });
}