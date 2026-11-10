
document.addEventListener("DOMContentLoaded", () => {
  const eyes = [...document.querySelectorAll(".ve-eye")];
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (!eyes.length || reducedMotion.matches) return;

  // Pupils follow the cursor without animation delay
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    eyes.forEach((eye) => {
      const rect = eye.getBoundingClientRect();

      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);

      const distance = Math.hypot(dx, dy) || 1;

      // Movement measured in SVG coordinates (0-100)
      const amount = Math.min(12, distance / 20);

      const x = (dx / distance) * amount;
      const y = (dy / distance) * amount;

      const pupil = eye.querySelector(".ve-pupil");

      pupil.setAttribute(
        "transform",
        `translate(${x} ${y})`
      );
    });
  }, { passive: true });

  
  // Blink at slightly irregular intervals
  function blink() {
    eyes.forEach((eye) => {
      const lid = eye.querySelector(".ve-eyelid");

      lid.animate(
        [
          { transform: "scaleY(0)" },
          { transform: "scaleY(1)" },
          { transform: "scaleY(0)" }
        ],
        {
          duration: 240,
          easing: "ease-in-out"
        }
      );
    });

    setTimeout(blink, 6000 + Math.random() * 4000);
  }

  setTimeout(blink, 3000);
});

