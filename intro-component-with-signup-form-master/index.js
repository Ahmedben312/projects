const inputs = document.querySelectorAll("input");
const claimBtn = document.getElementById("claim");

inputs.forEach((input) => {
  document.querySelectorAll(".error-message").forEach((msg) => msg.remove());

  let errorMessage = document.createElement("span");
  errorMessage.classList.add("error-message");
  let errorMark = document.createElement("img");
  errorMark.classList.add("error-mark");
  claimBtn.addEventListener("click", () => {
    if (input.value === "") {
      input.style.border = "1px solid red";
      input.style.color = "red";
      errorMessage.textContent = `${input.name} cannot be empty`;
      input.after(errorMessage);
      errorMark.src = "./images/icon-error.svg";
      input.after(errorMark);
    } else {
      input.style.border = "";
    }
    if (input.name === "Email Address") {
      if (input.value === "") {
        errorMessage.textContent = `${input.name} cannot be empty`;
        input.after(errorMessage);
        errorMark.src = "./images/icon-error.svg";
        input.after(errorMark);
      } else if (!input.value.includes("@") || !input.value.includes(".")) {
        input.style.border = "1px solid red";
        input.style.color = "red";
        errorMessage.textContent = "look like this is not an email";
        input.after(errorMessage);
        errorMark.src = "./images/icon-error.svg";
        input.after(errorMark);
      }
    }
  });
});
