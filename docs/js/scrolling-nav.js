document.querySelectorAll('a.js-scroll-trigger[href^="#"]').forEach(a => {
  a.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});
