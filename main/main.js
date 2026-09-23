document.addEventListener("DOMContentLoaded", () => {
  applySavedPreferences();
  initializeNavbar();
  initializeBackToTop();
  renderIcons();
});

function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function changeIcon(element, iconName) {
  if (!element) return;

  element.innerHTML = `<i data-lucide="${iconName}"></i>`;

  renderIcons();
}

function getPreference(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch {
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function applySavedPreferences() {
  const theme = getPreference("theme", "light");
  const direction = getPreference("direction", "ltr");

  document.body.classList.toggle("dark-mode", theme === "dark");

  document.documentElement.dir = direction === "rtl" ? "rtl" : "ltr";
}

function initializeNavbar() {
  const darkToggle = document.getElementById("darkToggle");
  const rtlToggle = document.getElementById("rtlToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const mobileQuote = document.querySelector(".mobile-quote");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");

      savePreference("theme", isDark ? "dark" : "light");

      updateToggleIcons();
    });
  }

  if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
      const currentDirection = document.documentElement.dir || "ltr";

      const newDirection = currentDirection === "rtl" ? "ltr" : "rtl";

      document.documentElement.dir = newDirection;

      savePreference("direction", newDirection);

      closeDropdowns();
      updateToggleIcons();
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = navLinks.classList.toggle("active");

      if (mobileQuote) {
        mobileQuote.classList.toggle("active", isOpen);
      }

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      updateToggleIcons();
    });
  }

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".dropdown-trigger");

    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      if (!isMobileNavigation()) return;

      event.preventDefault();
      event.stopPropagation();

      const wasOpen = dropdown.classList.contains("active");

      dropdowns.forEach((item) => {
        item.classList.remove("active");

        const itemTrigger = item.querySelector(".dropdown-trigger");

        if (itemTrigger) {
          itemTrigger.setAttribute("aria-expanded", "false");
        }
      });

      if (!wasOpen) {
        dropdown.classList.add("active");

        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  if (navLinks) {
    navLinks.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (!link) return;

      if (isMobileNavigation() && link.classList.contains("dropdown-trigger")) {
        return;
      }

      if (isMobileNavigation()) {
        closeMobileMenu();
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!isMobileNavigation()) return;

    const header = document.querySelector(".site-header");

    if (header && !header.contains(event.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (!isMobileNavigation()) {
      closeMobileMenu();
    }
  });

  setActiveNavLink();
  updateToggleIcons();
  renderIcons();
}

function closeMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const mobileQuote = document.querySelector(".mobile-quote");

  if (navLinks) {
    navLinks.classList.remove("active");
  }

  if (mobileQuote) {
    mobileQuote.classList.remove("active");
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }

  closeDropdowns();
  updateToggleIcons();
}

function closeDropdowns() {
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.classList.remove("active");

    const trigger = dropdown.querySelector(".dropdown-trigger");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

function updateToggleIcons() {
  const darkToggle = document.getElementById("darkToggle");
  const rtlToggle = document.getElementById("rtlToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const isDark = document.body.classList.contains("dark-mode");

  const isRTL = document.documentElement.dir === "rtl";

  const isMenuOpen = navLinks && navLinks.classList.contains("active");

  if (darkToggle) {
    changeIcon(darkToggle, isDark ? "sun" : "moon");

    darkToggle.title = isDark ? "Light Mode" : "Dark Mode";

    darkToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  }

  if (rtlToggle) {
    changeIcon(rtlToggle, "arrow-left-right");

    rtlToggle.title = isRTL ? "LTR Mode" : "RTL Mode";

    rtlToggle.setAttribute(
      "aria-label",
      isRTL ? "Switch to LTR mode" : "Switch to RTL mode",
    );
  }

  if (menuToggle) {
    changeIcon(menuToggle, isMenuOpen ? "x" : "menu");

    menuToggle.title = isMenuOpen ? "Close Menu" : "Menu";

    menuToggle.setAttribute(
      "aria-label",
      isMenuOpen ? "Close menu" : "Open menu",
    );

    menuToggle.setAttribute("aria-expanded", String(Boolean(isMenuOpen)));
  }
}

function isMobileNavigation() {
  return window.innerWidth <= 1024;
}

function setActiveNavLink() {
  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

  const links = document.querySelectorAll(".nav-links a");

  links.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  const homePages = ["index.html", "home2.html"];

  const homeTrigger = document.querySelector(".dropdown-trigger");

  if (homePages.includes(currentPage)) {
    if (homeTrigger) {
      homeTrigger.classList.add("active");
      homeTrigger.setAttribute("aria-current", "page");
    }

    document.querySelectorAll(".dropdown-menu a").forEach((link) => {
      if (getPageName(link.href) === currentPage) {
        link.classList.add("active");
      }
    });

    return;
  }

  links.forEach((link) => {
    if (link.classList.contains("dropdown-trigger")) {
      return;
    }

    if (getPageName(link.href) === currentPage) {
      link.classList.add("active");

      link.setAttribute("aria-current", "page");
    }
  });
}

function getPageName(url) {
  try {
    return (
      new URL(url, window.location.href).pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html"
    );
  } catch {
    return "";
  }
}

function initializeBackToTop() {
  const topButton = document.querySelector(".top-btn");

  if (!topButton) return;

  topButton.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
