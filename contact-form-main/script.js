const inputs = document.querySelectorAll("input");
const textarea = document.querySelector("textarea");
const submitBtn = document.querySelector("button");
const successContainer = document.querySelector("#success-container");

function checkInputs(event) {
  event.preventDefault();
  inputs.forEach((input) => {
    let errorText;
    switch (input.type) {
      case "radio": {
        const group = document.querySelectorAll(`[name=${input.name}]`);
        const isChecked = Array.from(group).some((radio) => radio.checked);
        errorText = input.closest("#query").querySelector(".error-text");
        if (!isChecked) {
          errorText.style.display = "block";
        } else {
          errorText.style.display = "none";
        }
        break;
      }
      case "checkbox": {
        errorText = input.closest("fieldset").querySelector(".error-text");
        if (!input.checked) {
          errorText.style.display = "block";
        } else {
          errorText.style.display = "none";
        }
        break;
      }

      default:
        errorText = input.closest("label").querySelector(".error-text");
        if (input.value.trim() === "" || input.type === "email") {
          errorText.style.display = "block";
        } else {
          errorText.style.display = "none";
          document.getElementById("valid-email").style.display = "none";
        }
        if (
          input.type === "email" &&
          !input.value.includes("@") &&
          input.value.trim() !== ""
        ) {
          document.getElementById("valid-email").style.display = "block";
          errorText.style.display = "none";
        } else {
          document.getElementById("valid-email").style.display = "none";
          errorText.style.display = "none";
        }
        break;
    }
    if (input.value.trim() !== "") {
      successContainer.style.display = "block";
    }
  });
}

submitBtn.addEventListener("click", checkInputs);
