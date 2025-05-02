// Pegar os elementos da página
const mainButton = document.querySelector(".main-button");
const subButtons = document.querySelector(".sub-buttons");
const subButtonElements = document.querySelectorAll(".sub-button");
const floatingButton = document.querySelector(".floating-button");

// Ver se os elementos foram encontrados
if (!mainButton || !subButtons || !floatingButton) {
  console.error("Não achei algum elemento:", {
    mainButton,
    subButtons,
    floatingButton,
  });
}

// Mostrar o botão principal
floatingButton.style.opacity = "1";

// Colocar o + dentro de um span pra girar
mainButton.innerHTML = "<span>+</span>";

// Deixar os sub-botões escondidos e pequenos no começo
subButtonElements.forEach((button) => {
  button.style.opacity = "0";
  button.style.transform = "translate(0, 0) scale(0.5)";
  button.style.left = "0"; // Começar no meio
  button.style.top = "0"; // Começar no meio
});

// Fazer o botão principal subir e descer (flutuar)
let floatAngle = 0;
let isFloating = true;

function floatButton() {
  if (!isFloating) return; // Parar se os sub-botões tão abertos

  const amplitude = 10; // Quanto ele sobe (em pixels)
  const speed = 0.05; // Velocidade do movimento
  const offsetY = Math.sin(floatAngle) * amplitude; // Fazer ele subir e descer

  // Mover o botão pra cima e pra baixo
  floatingButton.style.transform = `translateX(-50%) translateY(${offsetY}px)`;
  floatAngle += speed;

  requestAnimationFrame(floatButton); // Fazer o movimento continuar
}

// Começar o movimento de flutuar
requestAnimationFrame(floatButton);

// Função pra deixar o movimento mais macio
function cubicBezierEase(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Função pra abrir ou fechar os sub-botões
function animateSubButtons(show, callback) {
  const duration = 800; // Quanto tempo demora pra abrir ou fechar
  const startTime = performance.now();

  // Posições pra onde os sub-botões vão
  const positions = [
    { x: -120, y: -120 }, // WhatsApp
    { x: 0, y: -120 }, // Instagram
    { x: -60, y: -120 }, // Localização
    { x: 60, y: -120 }, // Telefone
  ];

  let completedAnimations = 0;
  const totalButtons = subButtonElements.length;

  subButtonElements.forEach((button, index) => {
    const delayIndex = show ? index : totalButtons - 1 - index;
    setTimeout(() => {
      let progress = 0;
      const startOpacity = parseFloat(button.style.opacity) || (show ? 0 : 1);
      const startScale =
        parseFloat(button.style.transform.match(/scale\(([^)]+)\)/)?.[1]) ||
        (show ? 0.5 : 1);

      function animate() {
        const elapsed = performance.now() - startTime;
        progress = Math.min(elapsed / duration, 1); // Ver quanto já passou

        const ease = cubicBezierEase(progress); // Deixar o movimento suave

        // Mover os sub-botões pras posições certas
        const currentX = show
          ? positions[index].x * ease
          : positions[index].x * (1 - ease);
        const currentY = show
          ? positions[index].y * ease
          : positions[index].y * (1 - ease);

        // Mudar a transparência e o tamanho
        const currentOpacity = show
          ? startOpacity + (1 - startOpacity) * ease
          : startOpacity - startOpacity * ease;
        const currentScale = show
          ? startScale + (1 - startScale) * ease
          : startScale - (startScale - 0.5) * ease;

        button.style.opacity = currentOpacity;
        button.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;

        if (progress < 1) {
          requestAnimationFrame(animate); // Continuar animando
        } else {
          button.style.opacity = show ? 1 : 0;
          button.style.transform = show
            ? `translate(${positions[index].x}px, ${positions[index].y}px) scale(1)`
            : `translate(0, 0) scale(0.5)`;
          completedAnimations++;
          if (completedAnimations === totalButtons && callback) {
            callback(); // Terminar tudo
          }
        }
      }

      requestAnimationFrame(animate);
    }, delayIndex * 50); // Esperar um pouco entre cada sub-botão
  });
}

// Guardar as posições finais dos sub-botões
subButtonElements.forEach((button, index) => {
  const positions = [
    { x: -120, y: -120 }, // WhatsApp
    { x: -60, y: -120 }, // Instagram
    { x: 0, y: -120 }, // Localização
    { x: 60, y: -120 }, // Telefone
  ];
  button.dataset.translateX = positions[index].x;
  button.dataset.translateY = positions[index].y;
});

// Quando clicar no botão principal
mainButton.addEventListener("click", () => {
  const isActive = subButtons.classList.contains("active");

  if (isActive) {
    // Fechar os sub-botões
    animateSubButtons(false, () => {
      subButtons.classList.remove("active");
      mainButton.innerHTML = "<span>+</span>";
      mainButton.classList.remove("active");
      floatingButton.classList.remove("pressed"); // Tirar o estado de aberto
      isFloating = true; // Voltar a flutuar
      requestAnimationFrame(floatButton); // Garantir que a animação de flutuação volte
    });
  } else {
    // Abrir os sub-botões
    subButtons.classList.add("active");
    mainButton.innerHTML = "<span>×</span>";
    mainButton.classList.add("active");
    floatingButton.classList.add("pressed"); // Mostrar que tá aberto
    animateSubButtons(true);
    isFloating = false; // Parar de flutuar
  }
});
