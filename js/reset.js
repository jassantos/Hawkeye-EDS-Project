function saveNewPassword() {
  const newPass = document.getElementById("newPass").value.trim();
  const email = localStorage.getItem("resetEmail");

  if (newPass === "") {
    alert("Enter new password");
    return;
  }

  // Save new password (demo only)
  localStorage.setItem("userPassword", newPass);

  alert("Password reset successful!");
  window.location.href = "login.html";
}