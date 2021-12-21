"use strict";

document.querySelector(".check").addEventListener("click", function () {
  const guess = document.querySelector(".guess").value;
  console.log(guess);

  if (!guess) {
    document.querySelector(".message").textContent = "🛑 No number!";
  }
});
