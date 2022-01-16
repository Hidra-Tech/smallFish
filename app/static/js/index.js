"use strict";

// ELEMENTS
// modal
const modal = document.querySelector(".modal");
const childOne = document.querySelector(".child-one");
const childTwo = document.querySelector(".child-two");
const childThree = document.querySelector(".child-three");
const childFour = document.querySelector(".child-four");
const overlay = document.querySelector(".overlay");
const btnCloseChildOne = document.querySelector(".xchild-one");
const btnCloseChildTwo = document.querySelector(".xchild-two");
const btnCloseChildThree = document.querySelector(".xchild-three");
const btnCloseChildFour = document.querySelector(".xchild-four");
const btnsOpenModal = document.querySelectorAll(".show-modal");
// other buttons
const cloneButtonDiscord = document.querySelector(".discord-clone");
// links
const socialNetworks = {
  discord: "https://discord.gg/tDkN7HFyRf",
};

// FUNCTIONS
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeChildOne = function () {
  childOne.classList.add("hidden");
  overlay.classList.add("hidden");
};

const closeChildTwo = function () {
  childTwo.classList.add("hidden");
  overlay.classList.add("hidden");
};

const closeChildThree = function () {
  childThree.classList.add("hidden");
  overlay.classList.add("hidden");
};

const closeChildFour = function () {
  childFour.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal[0].addEventListener("click", () => {
  childOne.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

btnsOpenModal[1].addEventListener("click", () => {
  childTwo.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

btnsOpenModal[2].addEventListener("click", () => {
  childThree.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

btnsOpenModal[3].addEventListener("click", () => {
  childFour.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

btnCloseChildOne.addEventListener("click", closeChildOne);
btnCloseChildTwo.addEventListener("click", closeChildTwo);
btnCloseChildThree.addEventListener("click", closeChildThree);
btnCloseChildFour.addEventListener("click", closeChildFour);

overlay.addEventListener("click", closeChildOne);
overlay.addEventListener("click", closeChildTwo);
overlay.addEventListener("click", closeChildThree);
overlay.addEventListener("click", closeChildFour);

document.addEventListener("keydown", function (e) {
  // console.log(e.key);

  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

cloneButtonDiscord.addEventListener("click", function () {
  const link = socialNetworks.discord;

  navigator.clipboard.writeText(link);
  this.src = "static/images/check_all.svg";
  setTimeout(() => {
    this.src = "static/images/clone_regular.svg";
  }, 500);
});
