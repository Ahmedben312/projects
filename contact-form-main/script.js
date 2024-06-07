const button = document.querySelector(".submit");
const inputBoxes = document.querySelectorAll("input");
const textInput = document.querySelector("textarea");
const raidoButton = document.getElementsByClassName("radio-button");
const checkBox = document.getElementsByClassName("checkbox");
const errorTexts = document.querySelectorAll("p");
const success = document.querySelector(".success");
button.addEventListener("click", (event) => {
  event.preventDefault();
  inputBoxes.forEach((input) => {
    if (input.value === "" && textInput.value === "") {
      input.style.border = "1px solid red";
      textInput.style.border = "1px solid red";
      errorTexts.forEach((errorText) => {
        errorText.style.display = "block";
      });
    } else {
      input.style.border = "";
      textInput.style.border = "";
      errorTexts.forEach((errorText) => {
        errorText.style.display = "none";
      });
      success.style.display = "flex";
    }
    /*if (
      input[type == "email"].value === "" ||
      !input[type == "email"].value.includes("@") ||
      !input[type == "email"].value.includes(".")
    ) {
      input[(type == "email")].style.border = "1px solid red";
      errorTexts.forEach((errorText) => {
        errorText.style.display = "block";
      });
    } else {
      input[type === "email"].style.border = "";
      errorTexts.forEach((errorText) => {
        errorText.style.display = "none";
      });
    }*/
    if (
      !Array.from(raidoButton).some((radio) => radio.checked) &&
      !Array.from(checkBox).some((checkBox) => checkBox.checked)
    ) {
      errorTexts.forEach((errorText) => {
        errorText.style.display = "block";
      });
    } else {
      errorTexts.forEach((errorText) => {
        errorText.style.display = "none";
      });
      success.style.display = "flex";
    }
  });
});
