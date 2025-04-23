const mainButton = document.querySelector(".botao-principal");
const subButtons = document.querySelector(".botoes");

mainButton.addEventListener("click", () => {
  subButtons.classList.toggle("active");
  mainButton.textContent = subButtons.classList.contains("active") ? "×" : "+";
});
