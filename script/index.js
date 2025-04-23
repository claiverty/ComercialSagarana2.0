const mainButton = document.querySelector(".main-button");
const subButtons = document.querySelector(".sub-buttons");
const subButtonElements = document.querySelectorAll(".sub-button");
const floatingButton = document.querySelector(".floating-button");

// Verificar se os elementos foram encontrados
if (!mainButton || !subButtons || !floatingButton) {
  console.error("Um ou mais elementos não foram encontrados:", {
    mainButton,
    subButtons,
    floatingButton,
  });
}

// Garantir que o botão principal esteja visível
floatingButton.style.opacity = "1";

// Envolver o texto do botão principal em um <span> para rotação
mainButton.innerHTML = "<span>+</span>";

// Inicialmente, definir os sub-botões como invisíveis e pequenos
subButtonElements.forEach((button) => {
  button.style.opacity = "0";
  button.style.transform = "translate(0, 0) scale(0.5)";
  button.style.left = "0"; // Garantir que a posição inicial seja o centro
  button.style.top = "0"; // Garantir que a posição inicial seja o centro
});

// Efeito de flutuação suave com JavaScript
let floatAngle = 0;
let isFloating = true;

function floatButton() {
  if (!isFloating) return; // Pausar animação se sub-botões estiverem abertos

  const amplitude = 10; // Altura do movimento (em pixels)
  const speed = 0.05; // Velocidade da animação
  const offsetY = Math.sin(floatAngle) * amplitude; // Movimento baseado em seno

  floatingButton.style.transform = `translateX(-50%) translateY(${offsetY}px)`;
  floatAngle += speed;

  requestAnimationFrame(floatButton); // Loop contínuo para animação suave
}

// Iniciar a animação de flutuação
requestAnimationFrame(floatButton);

// Função para um easing mais suave (cubic-bezier-like: 0.4, 0, 0.2, 1)
function cubicBezierEase(t) {
  // Aproximação de cubic-bezier(0.4, 0, 0.2, 1) - easeInOut
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Função para animar os sub-botões com movimento mais suave
function animateSubButtons(show, callback) {
  const duration = 800; // Duração para abertura e fechamento
  const startTime = performance.now();

  // Posições finais (definidas anteriormente)
  const positions = [
    { x: -120, y: -120 }, // WhatsApp
    { x: 0, y: -120 }, // Instagram
    { x: -60, y: -120 }, // Localização
    { x: 60, y: -120 }, // Telefone
  ];

  let completedAnimations = 0;
  const totalButtons = subButtonElements.length;

  subButtonElements.forEach((button, index) => {
    // Inverter o índice para o fechamento (começar pelo último botão)
    const delayIndex = show ? index : totalButtons - 1 - index;
    setTimeout(() => {
      let progress = 0;
      const startOpacity = parseFloat(button.style.opacity) || (show ? 0 : 1);
      const startScale =
        parseFloat(button.style.transform.match(/scale\(([^)]+)\)/)?.[1]) ||
        (show ? 0.5 : 1);

      function animate() {
        const elapsed = performance.now() - startTime;
        progress = Math.min(elapsed / duration, 1); // Progresso de 0 a 1

        // Usar o easing personalizado (cubic-bezier-like)
        const ease = cubicBezierEase(progress);

        // Calcular a posição atual com base no progresso
        const currentX = show
          ? positions[index].x * ease
          : positions[index].x * (1 - ease);
        const currentY = show
          ? positions[index].y * ease
          : positions[index].y * (1 - ease);

        // Animar opacidade e escala
        const currentOpacity = show
          ? startOpacity + (1 - startOpacity) * ease
          : startOpacity - startOpacity * ease;
        const currentScale = show
          ? startScale + (1 - startScale) * ease
          : startScale - (startScale - 0.5) * ease;

        button.style.opacity = currentOpacity;
        button.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Garante que os valores finais sejam exatos
          button.style.opacity = show ? 1 : 0;
          button.style.transform = show
            ? `translate(${positions[index].x}px, ${positions[index].y}px) scale(1)`
            : `translate(0, 0) scale(0.5)`;
          completedAnimations++;
          if (completedAnimations === totalButtons && callback) {
            callback(); // Chama o callback só depois que todas as animações terminarem
          }
        }
      }

      requestAnimationFrame(animate);
    }, delayIndex * 50); // Reduz o delay pra 50ms
  });
}

// Define as posições finais dos sub-botões
subButtonElements.forEach((button, index) => {
  const positions = [
    { x: -120, y: -120 }, // whatsApp
    { x: 0, y: -120 }, // instagram
    { x: -60, y: -120 }, // localização
    { x: 60, y: -120 }, // telefone
  ];
  button.dataset.translateX = positions[index].x;
  button.dataset.translateY = positions[index].y;
});

// Abrir/Fechar sub-botões
mainButton.addEventListener("click", () => {
  const isActive = subButtons.classList.contains("active");

  if (isActive) {
    // Fechar os sub-botões
    animateSubButtons(false, () => {
      subButtons.classList.remove("active");
      mainButton.innerHTML = "<span>+</span>";
      mainButton.classList.remove("active");
      floatingButton.classList.remove("pressed"); // Remover estado pressionado
      isFloating = true; // Retomar animação de flutuação
      floatingButton.style.transform = "translateX(-50%) translateY(0px)"; // Resetar a posição inicial
    });
  } else {
    // Abrir os sub-botões
    subButtons.classList.add("active");
    mainButton.innerHTML = "<span>×</span>";
    mainButton.classList.add("active");
    floatingButton.classList.add("pressed"); // Adicionar estado pressionado
    animateSubButtons(true);
    isFloating = false; // Pausar animação de flutuação
  }
});
