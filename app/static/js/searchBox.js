"use strict";

// ELEMENTS
const radioButtons = document.querySelector(".need-game-token");
const mainContainer = document.querySelector(".main-container");

// FUNCTIONS

const autocomplete = function (inp, arr) {
  /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  const addActive = function (x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  };
  const removeActive = function (x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  };
  const closeAllLists = function (elmnt) {
    /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  };
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
};

const searchBox = (gameTokens) => {
  const addButton = document.querySelector(".add");
  const removeButton = document.querySelector(".remove");
  let clickCount = new Array(50).fill(0);
  let addCount = -1;
  const nameTokens = gameTokens.map((x) => x.name);
  const colorSelected = function () {
    const tokenItems = document.querySelectorAll("li");
    let i = this.count;
    clickCount[i] = clickCount[i] + 1;
    if (clickCount[i] % 2 != 0) {
      tokenItems[i].style.backgroundColor = "DodgerBlue";
      tokenItems[i].style.color = "white";
      this.active = true;
    } else {
      tokenItems[i].style.backgroundColor = "white";
      tokenItems[i].style.color = "black";
      this.active = false;
    }
  };

  const addSelectedToken = () => {
    addCount++;
    const selectedToken = document.querySelector(".token-option").value;
    const listDiv = document.querySelector(".selected-tokens-list");
    const linkItem = document.createElement("a");
    const newToken = document.createElement("li");
    linkItem.href = "#";
    linkItem.append(newToken);
    newToken.classList.add("token-item");
    newToken.innerHTML = selectedToken;
    newToken.count = addCount;
    newToken.active = false;
    // newToken.setAttribute("onclick", "colorSelected()");
    newToken.addEventListener("click", colorSelected);
    listDiv.append(linkItem);
  };

  const removeSelectedToken = () => {
    let tokenItems = [...document.querySelectorAll("li")];
    let activeTokens = [];
    if (tokenItems != undefined) {
      for (let i = 0; i < tokenItems.length; i++) {
        activeTokens.push(tokenItems[i].active);
      }
    }

    if (tokenItems === undefined || activeTokens.every((x) => x === false)) {
      const boxButtons = document.querySelector(".box-buttons");
      const message = document.createElement("div");
      message.classList.add("remove-error");
      message.innerHTML =
        "Please, select at least one token in the right side to remove.";
      boxButtons.append(message);
    } else {
      let numberOfItems = tokenItems.length;

      for (let i = 0; i < numberOfItems; i++) {
        if (tokenItems[i].active === true) {
          tokenItems[i].remove();
        }
      }

      tokenItems = document.querySelectorAll("li");
      numberOfItems = tokenItems.length;
      // reset count list items
      for (let i = 0; i < numberOfItems; i++) {
        tokenItems[i].count = parseInt(i);
      }

      addCount = numberOfItems - 1;
      clickCount = new Array(50).fill(0);
    }
  };

  const deleteRemoveMessage = () => {
    const removeMessage = document.querySelector(".remove-error");

    if (removeMessage != undefined) {
      removeMessage.remove();
    }
  };

  // EVENTS and RUNNING FUNCTIONS
  addButton.addEventListener("click", addSelectedToken);
  removeButton.addEventListener("click", removeSelectedToken);
  document.body.addEventListener("click", deleteRemoveMessage, true);
  autocomplete(document.querySelector(".token-option"), nameTokens);
};
