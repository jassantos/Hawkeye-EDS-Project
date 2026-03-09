// Resend OTP (random 6-digit)
function resendOTP() {
  const newOTP = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  localStorage.setItem("otpCode", newOTP);

  alert("New OTP sent (demo OTP: " + newOTP + ")");
}

// Verify OTP (single input)
function verifyOTP(event) {
  event.preventDefault();

  const code = document.getElementById("otpInput").value.trim();
  const savedOTP = localStorage.getItem("otpCode");

  if (code === savedOTP) {
    alert("OTP verified!");
    window.location.href = "reset.html";
  } else {
    alert("Invalid OTP");
  }
}