const plus = document.querySelectorAll(".plus");
const dropDowns = document.querySelectorAll(".dropdown");
const containers = document.querySelectorAll(".h3-p-grp");
const main = document.getElementById("container");

containers.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    const icon = plus[index];
    const dropDown = dropDowns[index];
    if (
      icon.src.includes("icon-plus.svg") ||
      dropDown.style.display === "none"
    ) {
      dropDown.style.display = "block";
      icon.src = "./assets/images/icon-minus.svg";
      main.style.height = main.offsetHeight + dropDown.offsetHeight + "px";
    } else if (
      icon.src.includes("icon-minus.svg") ||
      dropDown.style.display === "block"
    ) {
      const dropDownHeight = parseFloat(getComputedStyle(dropDown).height);
      dropDown.style.display = "none";
      icon.src = "./assets/images/icon-plus.svg";
      main.style.height = main.offsetHeight - dropDownHeight + "px";
    }
  });
});
