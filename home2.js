document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  const celebrationTabs = document.querySelectorAll(".celebration-tab");
  const celebrationMain = document.querySelector(".celebration-main");
  const celebrationImage = document.getElementById("celebrationImage");
  const celebrationTitle = document.getElementById("celebrationTitle");
  const celebrationDescription = document.getElementById(
    "celebrationDescription",
  );
  const celebrationCount = document.getElementById("celebrationCount");

  celebrationTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("active")) return;

      celebrationTabs.forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      celebrationMain.classList.add("is-changing");

      const image = tab.dataset.image;
      const title = tab.dataset.title;
      const description = tab.dataset.description;
      const count = tab.dataset.count;

      setTimeout(() => {
        celebrationImage.src = image;
        celebrationImage.alt = title;
        celebrationTitle.textContent = title;
        celebrationDescription.textContent = description;
        celebrationCount.textContent = count;

        celebrationMain.classList.remove("is-changing");
      }, 220);
    });
  });
});
