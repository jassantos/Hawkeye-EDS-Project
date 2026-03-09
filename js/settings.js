document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab-link");
  const sections = document.querySelectorAll(".settings-section");
  document.getElementById("Edit-Profile").style.display = "block";
  document
    .querySelector('.tab-link[href="#Edit-Profile"]')
    .classList.add("active");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => (s.style.display = "none"));
      this.classList.add("active");
      const target = this.getAttribute("href").substring(1);
      document.getElementById(target).style.display = "block";
    });
  });
});
