// main.js — global script for Hawkeye EDS

console.log("Hawkeye EDS Portal Loaded");

// Global logout function (optional)
function logout() {
  if (confirm("Are you sure you want to log out?")) {
    window.location.href = "login.html";
  }
}

// Registration submit handler (for index.html)
document.addEventListener("DOMContentLoaded", () => {

  const confirmPassword = document.getElementById("confirmPassword");
  const regForm = document.querySelector("form");

  // If this page is NOT the registration page, do nothing
  if (!regForm || !confirmPassword) return;

  regForm.addEventListener("submit", (e) => {
    e.preventDefault(); // STOP POST / STOP 405

    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const confirmPass = document.getElementById("confirmPassword")?.value.trim();
    const terms = document.getElementById("terms")?.checked;

    // 🔹 Basic validations
    if (!firstName || !lastName || !phone || !email || !password || !confirmPass) {
      alert("Please fill all fields.");
      return;
    }

    // 🔹 Phone number validation (only digits, minimum 10 digits)
    const phonePattern = /^[0-9]{10,}$/;

    if (!phonePattern.test(phone)) {
      alert("Phone number must contain only digits and be at least 10 digits long.");
      return;
    }

    // 🔹 Password minimum 8 characters
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // 🔹 Password strength check
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordPattern.test(password)) {
      alert("Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.");
      return;
    }

    // 🔹 Password match check
    if (password !== confirmPass) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    // 🔹 Terms check
    if (!terms) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }

    // ✅ Success → go to login page
    alert("Registration successful! Please log in.");
    window.location.href = "login.html";
  });

});

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'login.html';
  }
}