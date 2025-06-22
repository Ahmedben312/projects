document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const uploadIcon = document.getElementById("upload-icon");
  const uploadText = document.getElementById("upload-text");
  const inputs = document.querySelectorAll("input");
  const labels = document.querySelectorAll("label");
  const infoIcon = document.getElementById("info-icon");
  const uploadSpan = document.getElementById("upload-span");
  const avatar = document.getElementById("avatar");
  const fileInput = document.getElementById("file-input");
  const ticketNumber = document.getElementById("ticket-number");
  const ticketContainer = document.getElementById("ticket-container");
  const generateBtn = document.getElementById("generate-btn");

  function generateTicket() {
    if (!checkInput()) {
      return;
    }
    form.style.display = "none";
    generateBtn.style.display = "none";
    ticketContainer.style.display = "flex";
    const avatarImg = fileInput.files[0];
    if (avatarImg) {
      const avatarUrl = URL.createObjectURL(avatarImg);
      avatar.src = avatarUrl;
    }
    inputs.forEach((input) => {
      const dataName = input.getAttribute("data-name");
      const textElements = document.querySelectorAll(`[data-name=${dataName}]`);
      textElements.forEach((textElement) => {
        textElement.textContent = input.value;
      });
    });

    generateRandomTicketNumber();
  }

  function generateRandomTicketNumber() {
    const randomTicketNumber = Math.floor(Math.random() * 100000);
    ticketNumber.textContent = "#" + randomTicketNumber;
  }

  function checkInput() {
    clearPreviousErrors();
    let isValid = true;
    const maxSizeInKb = 500 * 1024;
    if (fileInput && fileInput.files.length > 0) {
      if (fileInput.files[0].size > maxSizeInKb) {
        const fileLabel = document.querySelector('label[for="file-input"]');
        fileInput.value = "";
        const errorIcon = createErrorIcon();
        const wrongSize = document.createElement("p");
        wrongSize.classList.add("error");
        wrongSize.textContent = "File size must be less than 500KB";
        wrongSize.style.color = "hsl(7, 71%, 60%)";
        uploadSpan.style.display = "none";
        infoIcon.style.display = "none";
        fileLabel.insertAdjacentElement("afterend", errorIcon);
        fileLabel.insertAdjacentElement("afterend", wrongSize);

        isValid = false;
      }
    }
    inputs.forEach((input) => {
      const label = document.querySelector(
        `label[for="${input.getAttribute("name")}"]`
      );
      if (input.value.trim() === "") {
        const errorIcon = createErrorIcon();
        const errorMessage = document.createElement("p");
        errorMessage.classList.add("error");
        errorMessage.textContent = "This field is required";
        errorMessage.style.color = "hsl(7, 71%, 60%)";
        input.style.border = "3px solid hsl(7, 88%, 67%)";
        uploadSpan.style.display = "none";
        infoIcon.style.display = "none";

        label.insertAdjacentElement("afterend", errorIcon);
        label.insertAdjacentElement("afterend", errorMessage);

        isValid = false;
      }

      if (
        input.type === "email" &&
        input.value.trim() !== "" &&
        !input.value.includes("@")
      ) {
        const errorIcon = createErrorIcon();
        const wrongEmail = document.createElement("p");
        wrongEmail.classList.add("error");
        wrongEmail.textContent = "Email is not valid";
        wrongEmail.style.color = "hsl(7, 71%, 60%)";
        input.style.border = "3px solid hsl(7, 88%, 67%)";
        uploadSpan.style.display = "none";
        label.insertAdjacentElement("afterend", errorIcon);
        label.insertAdjacentElement("afterend", wrongEmail);
        isValid = false;
      }
      if (
        input.name === "github-username" &&
        input.value.trim() !== "" &&
        !input.value.startsWith("@")
      ) {
        const errorIcon = createErrorIcon();
        const wrongFormat = document.createElement("p");
        wrongFormat.classList.add("error");
        wrongFormat.textContent = "Wrong format";
        wrongFormat.style.color = "hsl(7, 71%, 60%)";
        input.style.border = "3px solid hsl(7, 88%, 67%)";
        label.insertAdjacentElement("afterend", errorIcon);
        label.insertAdjacentElement("afterend", wrongFormat);
      }
    });
    return isValid;
  }

  function createErrorIcon() {
    const errorIcon = document.createElement("img");
    errorIcon.classList.add("error-icon");
    errorIcon.src = "./assets/images/icon-info.svg";
    return errorIcon;
  }

  function clearPreviousErrors() {
    const errorMessages = document.querySelectorAll("form p");
    errorMessages.forEach((message) => message.remove());
    const errorIcons = document.querySelectorAll(".error-icon");
    errorIcons.forEach((icon) => icon.remove());
  }

  function changeDeleteImage() {
    uploadIcon.style.display = "none";
    uploadText.style.display = "none";
    const uploadContainer = document.getElementById("upload-avatar-container");
    const existingPreviewContainer = document.getElementById("preview");
    if (existingPreviewContainer) {
      existingPreviewContainer.remove();
    }
    const previewContainer = document.createElement("div");
    previewContainer.id = "preview";
    const avatarImg = fileInput.files[0];
    const avatarUrl = URL.createObjectURL(avatarImg);
    previewContainer.innerHTML = `
  <img src="${avatarUrl}" id="preview-avatar" alt="preview-avatar"/>
  <button id="remove-btn" class="preview-btn">Remove image</button>
  <button id="change-btn" class="preview-btn">Change image</button>
  `;
    uploadContainer.appendChild(previewContainer);

    document.getElementById("remove-btn").addEventListener("click", (e) => {
      e.preventDefault();
      removeImage();
    });
    document
      .getElementById("change-btn")
      .addEventListener("click", changeImage);
  }
  function removeImage() {
    fileInput.value = "";
    avatar.src = "";
    const previewContainer = document.getElementById("preview");
    if (previewContainer) {
      previewContainer.remove();
    }
    uploadIcon.style.display = "block";
    uploadText.style.display = "block";
  }
  function changeImage() {
    fileInput.click();
  }

  generateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    generateTicket();
  });

  fileInput.addEventListener("change", changeDeleteImage);
});
