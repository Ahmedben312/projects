// Basic JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  console.log("E-commerce shop loaded");

  // Auto-hide messages after 5 seconds
  const messages = document.querySelectorAll(".message");
  messages.forEach((message) => {
    setTimeout(() => {
      message.style.display = "none";
    }, 5000);
  });
});
