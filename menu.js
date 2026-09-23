document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const tabs = document.querySelectorAll(".menu-tab");
  const products = document.querySelectorAll(".menu-product");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.category;

      tabs.forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      products.forEach((product) => {
        const productCategory = product.dataset.menuCategory;

        if (category === "all" || productCategory === category) {
          product.classList.remove("menu-product--hidden");
        } else {
          product.classList.add("menu-product--hidden");
        }
      });
    });
  });
});