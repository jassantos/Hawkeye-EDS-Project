// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password");
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
}

// Login submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop page refresh

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // check if fields are empty
    if (email === "" || password === "") {
      alert("Please enter email and password.");
      return;
    }

    // Save credentials (ONLY FOR DEMO / LEARNING)
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password); // not secure in real apps

    alert("Login successful!");
    window.location.href = "dashboard.html";
  });
});