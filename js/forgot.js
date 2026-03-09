function sendReset(event) {
  event.preventDefault();

  const email = document.getElementById("resetEmail").value.trim();

  if (email === "") {
    alert("Please enter email");
    return;
  }

  localStorage.setItem("resetEmail", email);

  // Generate random 4-digit OTP
  const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

  localStorage.setItem("otpCode", generatedOTP);

  alert("OTP sent to your email (demo OTP: " + generatedOTP + ")");
  window.location.href = "otp.html";
}