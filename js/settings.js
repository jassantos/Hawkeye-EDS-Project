document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabs = document.querySelectorAll(".tab-link");
  const sections = document.querySelectorAll(".settings-section");
  
  // Show first tab by default
  if (sections.length > 0) {
    sections[0].style.display = "block";
  }
  if (tabs.length > 0) {
    tabs[0].classList.add("active");
  }
  
  // Tab click handler
  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));
      
      // Hide all sections
      sections.forEach((s) => (s.style.display = "none"));
      
      // Add active class to clicked tab
      this.classList.add("active");
      
      // Show corresponding section
      const target = this.getAttribute("href").substring(1);
      document.getElementById(target).style.display = "block";
    });
  });
  
  // Save buttons functionality
  const saveProfileBtn = document.getElementById("saveProfile");
  const savePreferencesBtn = document.getElementById("savePreferences");
  const updatePasswordBtn = document.getElementById("updatePassword");
  
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", function(e) {
      e.preventDefault();
      showNotification("Profile updated successfully!", "success");
      // In a real app, you would submit the form data here
    });
  }
  
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener("click", function(e) {
      e.preventDefault();
      showNotification("Preferences saved successfully!", "success");
    });
  }
  
  if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener("click", function(e) {
      e.preventDefault();
      const currentPass = document.getElementById("current-password").value;
      const newPass = document.getElementById("new-password").value;
      const confirmPass = document.getElementById("confirm-password").value;
      
      if (!currentPass || !newPass || !confirmPass) {
        showNotification("Please fill in all password fields", "error");
        return;
      }
      
      if (newPass !== confirmPass) {
        showNotification("New passwords do not match", "error");
        return;
      }
      
      if (newPass.length < 8) {
        showNotification("Password must be at least 8 characters", "error");
        return;
      }
      
      showNotification("Password updated successfully!", "success");
      document.getElementById("current-password").value = "";
      document.getElementById("new-password").value = "";
      document.getElementById("confirm-password").value = "";
      
      // Reset strength indicator
      const strengthBar = document.getElementById("strengthBar");
      const strengthText = document.getElementById("strengthText");
      if (strengthBar && strengthText) {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "#ff4757";
        strengthText.textContent = "Weak";
        strengthText.style.color = "#ff4757";
      }
    });
  }
  
  // Toggle switches functionality
  const toggleSwitches = document.querySelectorAll('.switch input[type="checkbox"]');
  toggleSwitches.forEach(switchInput => {
    switchInput.addEventListener('change', function() {
      const label = this.closest('.switch').querySelector('.toggle-label');
      const status = this.checked ? 'enabled' : 'disabled';
      showNotification(`${label.textContent} ${status}`, 'info');
    });
  });
  
  // Profile image change functionality
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const profileImage = document.getElementById("profileImage");
  
  if (changePhotoBtn && profileImage) {
    changePhotoBtn.addEventListener("click", function(e) {
      e.preventDefault();
      // Create file input
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);
      
      fileInput.click();
      
      fileInput.addEventListener("change", function() {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          reader.onload = function(e) {
            profileImage.src = e.target.result;
            showNotification("Profile photo updated", "success");
          };
          reader.readAsDataURL(this.files[0]);
        }
        document.body.removeChild(fileInput);
      });
    });
  }
  
  // Password strength indicator
  const newPasswordInput = document.getElementById("new-password");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  
  if (newPasswordInput && strengthBar && strengthText) {
    newPasswordInput.addEventListener("input", function() {
      const password = this.value;
      let strength = 0;
      let color = "#ff4757";
      let text = "Weak";
      
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      
      if (strength === 0) {
        color = "#ff4757";
        text = "Weak";
      } else if (strength <= 2) {
        color = "#FFC107";
        text = "Fair";
      } else if (strength === 3) {
        color = "#4CAF50";
        text = "Good";
      } else {
        color = "#27ae60";
        text = "Strong";
      }
      
      strengthBar.style.width = (strength * 25) + "%";
      strengthBar.style.backgroundColor = color;
      strengthText.textContent = text;
      strengthText.style.color = color;
    });
  }
  
  // Helper function to show notifications
  function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;
    
    if (type === "success") {
      notification.style.backgroundColor = "#27ae60";
    } else if (type === "error") {
      notification.style.backgroundColor = "#ff4757";
    } else {
      notification.style.backgroundColor = "#3498db";
    }
    
    // Close button
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    `;
    
    closeBtn.addEventListener("click", function() {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
    
    // Add CSS animations if not already present
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement("style");
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
});