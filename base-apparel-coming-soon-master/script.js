const button = document.querySelector("button");
const inputBox = document.querySelector("input");
const inputContainer = document.querySelector(".input-container");

button.addEventListener("click", () => {
  if (!inputBox.value.includes("@")) {
    inputBox.style.border = "1px solid red";
    button.classList.toggle("clicked");
    const warning = document.createElement("img");
    warning.src = "./images/icon-error.svg";
    warning.alt = "warning image";
    warning.classList.add("warning-mark");
    inputContainer.appendChild(warning);
  } else {
    inputBox.style.border = "1px solid hsl(0, 36%, 70%)";
  }
});
