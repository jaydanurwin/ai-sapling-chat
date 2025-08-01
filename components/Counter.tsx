const counterScript = `
  import canvasConfetti from "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/+esm";
  let count = 0;
  window.increment = () => {
    count++;
    const counterElement = document.getElementById("counter-count");
    if (counterElement) {
        counterElement.textContent = count.toString();
    }
    if (count === 3) {
      canvasConfetti({ particleCount: 100, colors: ["#cdac26", "#d0d0d1", "#292929", "#1b791f"], spread: 70, origin: { y: 0.6 } });
    }
  };
`;

export function Counter() {
  return (
    <sapling-island loading="visible">
      <template>
         <script type="module" dangerouslySetInnerHTML={{ __html: counterScript }}></script>
      </template>
        <button
          id="counter-button"
          onclick="window.increment?.()" 
          className="mt-4 px-6 py-3 bg-gray-900 @dark:bg-white text-white @dark:text-gray-900 font-medium rounded-full hover:bg-gray-800 @dark:hover:bg-gray-100 transition duration-150 flex items-center gap-2">
          Click Count: <span id="counter-count">0</span>
        </button>
    </sapling-island>
  );
}