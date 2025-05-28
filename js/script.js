// === DOM ELEMENTS ===
const billInput = document.getElementById("bill-input");
const tipButtons = document.querySelectorAll(".tip__button");
const customTipInput = document.getElementById("custom-tip-input");
const peopleInput = document.getElementById("people-input");
const tipAmountDisplay = document.querySelector(
  ".result__item:nth-child(1) .result__value"
);
const totalDisplay = document.querySelector(
  ".result__item:nth-child(2) .result__value"
);
const resetButton = document.querySelector(".result__reset-button");
const peopleErrorLabel = document.querySelector(".people__error-label");
const peopleInvalidLabel = document.querySelector(".people__invalid-label");
const billInvalidLabel = document.querySelector(".bill__invalid-label");

// === STATE ===
let billValue = 0;
let tipValue = 0;
let peopleValue = 1;

// === HELPERS ===
function setDisplay(el, show) {
  el.style.display = show ? "inline" : "none";
}
function clearInputError(input, label) {
  input.classList.remove("error");
  setDisplay(label, false);
}

// === FUNCTIONS ===
function handleBillInput() {
  billValue = parseFloat(billInput.value) || 0;
  calculateResults();
}

function handleTipButtonClick(event) {
  tipButtons.forEach((button) => button.classList.remove("active"));
  event.target.classList.add("active");
  tipValue = parseFloat(event.target.textContent.replace("%", "")) / 100;
  customTipInput.value = "";
  customTipInput.classList.remove("active");
  calculateResults();
}

function handleCustomTipInput() {
  tipButtons.forEach((button) => button.classList.remove("active"));
  tipValue = parseFloat(customTipInput.value) / 100 || 0;
  customTipInput.classList.toggle("active", !!customTipInput.value);
  calculateResults();
}

function handlePeopleInput() {
  let value = parseInt(peopleInput.value, 10);
  if (peopleInput.value === "") {
    clearInputError(peopleInput, peopleErrorLabel);
    peopleValue = 0;
  } else if (value <= 0 || isNaN(value)) {
    peopleInput.classList.add("error");
    setDisplay(peopleErrorLabel, true);
    peopleValue = 0;
  } else {
    clearInputError(peopleInput, peopleErrorLabel);
    peopleValue = value;
  }
  calculateResults();
}

function calculateResults() {
  if (peopleValue > 0) {
    const tipAmount = (billValue * tipValue) / peopleValue;
    const total = (billValue + billValue * tipValue) / peopleValue;
    tipAmountDisplay.textContent = `$${tipAmount.toFixed(2)}`;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
  } else {
    tipAmountDisplay.textContent = "$0.00";
    totalDisplay.textContent = "$0.00";
  }
}

function resetCalculator() {
  billInput.value = "";
  tipButtons.forEach((button) => button.classList.remove("active"));
  customTipInput.value = "";
  customTipInput.classList.remove("active");
  peopleInput.value = "1";
  tipAmountDisplay.textContent = "$0.00";
  totalDisplay.textContent = "$0.00";
  billValue = 0;
  tipValue = 0;
  peopleValue = 1;
  clearInputError(billInput, billInvalidLabel);
  clearInputError(peopleInput, peopleErrorLabel);
  setDisplay(peopleInvalidLabel, false);
  if (!customTipInput.value)
    customTipInput.setAttribute("placeholder", "Custom");
  setResetButtonState();
}

function setResetButtonState() {
  const isBillEmpty = !billInput.value;
  const isTipEmpty =
    !Array.from(tipButtons).some((btn) => btn.classList.contains("active")) &&
    !customTipInput.value;
  const isPeopleEmpty = !peopleInput.value;
  resetButton.disabled = isBillEmpty && isTipEmpty && isPeopleEmpty;
}

// === EVENT LISTENERS === //

// Bill input
billInput.addEventListener("input", () => {
  handleBillInput();
  setResetButtonState();
});
billInput.addEventListener("keydown", function (e) {
  if (
    [46, 8, 9, 27, 13].includes(e.keyCode) ||
    ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88, 90].includes(e.keyCode)) ||
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    setDisplay(billInvalidLabel, false);
    return;
  }
  if (e.key === "." && !this.value.includes(".")) {
    setDisplay(billInvalidLabel, false);
    return;
  }
  if (
    (e.key.length === 1 && !/[0-9.]/.test(e.key)) ||
    e.key === "-" ||
    e.key === "," ||
    (e.key === "." && this.value.includes("."))
  ) {
    e.preventDefault();
    setDisplay(billInvalidLabel, true);
  } else {
    setDisplay(billInvalidLabel, false);
  }
});
billInput.addEventListener("input", function () {
  if (/^\d*\.?\d*$/.test(this.value)) setDisplay(billInvalidLabel, false);
});

// Tip buttons
tipButtons.forEach((button) =>
  button.addEventListener("click", (event) => {
    handleTipButtonClick(event);
    setResetButtonState();
  })
);

// Custom tip input
customTipInput.addEventListener("input", () => {
  // Remove any invalid characters (allow only digits and one dot)
  let val = customTipInput.value.replace(/[^0-9.]/g, "");
  const parts = val.split(".");
  if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
  customTipInput.value = val;
  handleCustomTipInput();
  setResetButtonState();
});
customTipInput.addEventListener("focus", function () {
  this.removeAttribute("placeholder");
});
customTipInput.addEventListener("blur", function () {
  if (!this.value) this.setAttribute("placeholder", "Custom");
});
customTipInput.addEventListener("keydown", function (e) {
  if (
    [46, 8, 9, 27, 13].includes(e.keyCode) ||
    ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88, 90].includes(e.keyCode)) ||
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    return;
  }
  if (e.key === "." && !this.value.includes(".")) return;
  if (
    (e.key.length === 1 && !/[0-9.]/.test(e.key)) ||
    e.key === "-" ||
    e.key === "," ||
    (e.key === "." && this.value.includes("."))
  ) {
    e.preventDefault();
  }
});

// People input
peopleInput.addEventListener("input", function () {
  // Show invalid message if dot is present
  if (this.value.includes(".")) {
    peopleInvalidLabel.textContent = "Only whole numbers allowed";
    setDisplay(peopleInvalidLabel, true);
  } else {
    setDisplay(peopleInvalidLabel, false);
  }
  // Remove any non-digit characters
  this.value = this.value.replace(/[^0-9]/g, "");
  handlePeopleInput();
  setResetButtonState();
});
peopleInput.addEventListener("focus", function () {
  if (this.value === "1") this.value = "";
});
peopleInput.addEventListener("keydown", function (e) {
  if (
    [46, 8, 9, 27, 13].includes(e.keyCode) ||
    ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88, 90].includes(e.keyCode)) ||
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    setDisplay(peopleInvalidLabel, false);
    return;
  }
  if (
    (e.key.length === 1 && !/[0-9]/.test(e.key)) ||
    e.key === "-" ||
    e.key === "." ||
    e.key === "," ||
    e.key === "+"
  ) {
    e.preventDefault();
    peopleInvalidLabel.textContent = "Only whole numbers allowed";
    setDisplay(peopleInvalidLabel, true);
  } else {
    setDisplay(peopleInvalidLabel, false);
  }
});

// Remove placeholder when typing for all inputs
[billInput, customTipInput, peopleInput].forEach((input) => {
  input.addEventListener("input", function () {
    if (this.value !== "") {
      this.removeAttribute("placeholder");
    } else {
      if (this === billInput) this.setAttribute("placeholder", "0");
      if (this === customTipInput) this.setAttribute("placeholder", "Custom");
      if (this === peopleInput) this.setAttribute("placeholder", "1");
    }
  });
});

// Reset button
resetButton.addEventListener("click", () => {
  resetCalculator();
  setResetButtonState();
  resetButton.disabled = true;
});

// === INIT === //
setResetButtonState();
