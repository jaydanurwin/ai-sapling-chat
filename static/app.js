console.log("hello, world!");

const button = document.querySelector("button");

button.addEventListener("click", () => {
  document.body.classList.toggle("bg-red-500");
});