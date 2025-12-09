function createGlassElements() {
  const glass = document.querySelector(".glass");

  const elements = [
    {
      className: "glass-overlay",
      style: `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.25) 0%,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0.05) 40%,
        transparent 70%
      );
      z-index: 2;
      pointer-events: none;
    `,
    },

    {
      className: "glass-inner",
      style: `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 25%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0.05) 75%,
        rgba(255, 255, 255, 0.1) 100%
      );
      z-index: 3;
      pointer-events: none;
      mix-blend-mode: overlay;
    `,
    },

    {
      className: "glass-reflection",
      style: `
      position: absolute;
      top: 15%;
      left: 15%;
      width: 30%;
      height: 15%;
      border-radius: 50%;
      background: radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      z-index: 4;
      pointer-events: none;
      transform: rotate(45deg);
      filter: blur(1px);
    `,
    },

    {
      className: "glass-border",
      style: `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      border: 2px solid rgba(255, 255, 255, 0.15);
      z-index: 5;
      pointer-events: none;
      box-sizing: border-box;
    `,
    },
  ];

  elements.forEach((el) => {
    const element = document.createElement("div");
    element.className = el.className;
    element.style.cssText = el.style;
    glass.appendChild(element);
  });
}

document.addEventListener("DOMContentLoaded", createGlassElements);

const sliderContainer = document.querySelector(".slider-container");
const glass = document.querySelector(".glass");

let isOverSlide = false;
let mouseX = 0;
let mouseY = 0;
let rafId = null;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

let glassX = 0;
let glassY = 0;
let targetX = 0;
let targetY = 0;

function updateGlassPosition() {
  glassX = lerp(glassX, targetX, 0.2);
  glassY = lerp(glassY, targetY, 0.2);

  glass.style.left = `${glassX}px`;
  glass.style.top = `${glassY}px`;

  rafId = requestAnimationFrame(updateGlassPosition);
}

updateGlassPosition();

sliderContainer.addEventListener("mousemove", (e) => {
  const rect = sliderContainer.getBoundingClientRect();
  mouseX = e.clientX;
  mouseY = e.clientY;
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;

  const slides = document.querySelectorAll(".slide");
  let foundSlide = null;

  slides.forEach((slide) => {
    const slideRect = slide.getBoundingClientRect();
    if (
      mouseX >= slideRect.left &&
      mouseX <= slideRect.right &&
      mouseY >= slideRect.top &&
      mouseY <= slideRect.bottom
    ) {
      foundSlide = slide;
    }
  });

  if (foundSlide) {
    isOverSlide = true;
    glass.style.opacity = "1";

    const img = foundSlide.querySelector("img");
    const slideRect = foundSlide.getBoundingClientRect();

    const relX = mouseX - slideRect.left;
    const relY = mouseY - slideRect.top;

    const zoomFactor = 2.5;
    const glassSize = 240;

    const bgX = (relX / slideRect.width) * 100;
    const bgY = (relY / slideRect.height) * 100;

    const distortionX = Math.sin(relX * 0.01 + Date.now() * 0.001) * 5;
    const distortionY = Math.cos(relY * 0.01 + Date.now() * 0.001) * 5;

    glass.style.backgroundImage = `url(${img.src})`;
    glass.style.backgroundSize = `${zoomFactor * 100}%`;
    glass.style.backgroundPosition = `${bgX}% ${bgY}%`;

    const time = Date.now() * 0.001;
    const radius1 = 40 + Math.sin(time * 2) * 3;
    const radius2 = 60 + Math.cos(time * 2.3) * 3;
    const radius3 = 50 + Math.sin(time * 1.7) * 4;
    const radius4 = 55 + Math.cos(time * 2.1) * 3;

    glass.style.borderRadius = `${radius1}% ${radius2}% ${radius3}% ${radius4}% / ${radius2}% ${radius1}% ${radius4}% ${radius3}%`;

    const scale = 1 + Math.sin(time * 3) * 0.01;
    glass.style.transform = `translate(-50%, -50%) scale(${scale})`;
  } else {
    isOverSlide = false;
    glass.style.opacity = "0";
  }
});

sliderContainer.addEventListener("mouseleave", () => {
  isOverSlide = false;
  glass.style.opacity = "0";
});

function addWaterRipple() {
  if (!isOverSlide) return;

  const ripple = document.createElement("div");
  ripple.style.position = "absolute";
  ripple.style.left = "50%";
  ripple.style.top = "50%";
  ripple.style.width = "10px";
  ripple.style.height = "10px";
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(255, 255, 255, 0.2)";
  ripple.style.transform = "translate(-50%, -50%)";
  ripple.style.zIndex = "101";
  ripple.style.pointerEvents = "none";
  glass.appendChild(ripple);

  let size = 10;
  let opacity = 0.2;

  function expand() {
    size += 2;
    opacity -= 0.02;

    if (opacity > 0) {
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.opacity = opacity;
      requestAnimationFrame(expand);
    } else {
      ripple.remove();
    }
  }

  expand();
}

setInterval(() => {
  if (isOverSlide && Math.random() > 0.7) {
    addWaterRipple();
  }
}, 800);

sliderContainer.addEventListener("click", () => {
  if (isOverSlide) {
    addWaterRipple();
  }
});

function sendEmail(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const subject = encodeURIComponent("Projekat");
  const body = encodeURIComponent(`Poštovani,\n\n`);

  window.location.href = `mailto:breda@mi-studio.org?subject=${subject}&body=${body}`;
}


  lazyImages.forEach((img) => observer.observe(img));
});

