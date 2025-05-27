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

// === FUNCTIONS ===
function handleBillInput() {
  billValue = parseFloat(billInput.value) || 0;
  calculateResults();
}

function handleTipButtonClick(event) {
  tipButtons.forEach((button) => button.classList.remove("active"));
  event.target.classList.add("active");
  tipValue = parseFloat(event.target.textContent.replace("%", "")) / 100;
  customTipInput.value = ""; // Clear custom tip input
  calculateResults();
}

function handleCustomTipInput() {
  tipButtons.forEach((button) => button.classList.remove("active"));
  tipValue = parseFloat(customTipInput.value) / 100 || 0;
  // Toggle active class for custom tip input
  if (customTipInput.value) {
    customTipInput.classList.add("active");
  } else {
    customTipInput.classList.remove("active");
  }
  calculateResults();
}

function handlePeopleInput() {
  let value = parseInt(peopleInput.value, 10);
  if (peopleInput.value === "") {
    // Allow empty, don't force "1"
    peopleInput.classList.remove("error");
    peopleErrorLabel.style.display = "none";
    peopleValue = 0;
  } else if (value <= 0 || isNaN(value)) {
    peopleInput.classList.add("error");
    peopleErrorLabel.style.display = "block";
    peopleValue = 0;
  } else {
    peopleInput.classList.remove("error");
    peopleErrorLabel.style.display = "none";
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
  customTipInput.classList.remove("active"); // Remove active state on reset
  peopleInput.value = "1"; // Set to 1 only on reset
  tipAmountDisplay.textContent = "$0.00";
  totalDisplay.textContent = "$0.00";
  billValue = 0;
  tipValue = 0;
  peopleValue = 1;

  // Hide error/invalid labels and remove error classes
  billInput.classList.remove("error");
  peopleInput.classList.remove("error");
  billInvalidLabel.style.display = "none";
  peopleErrorLabel.style.display = "none";
  peopleInvalidLabel.style.display = "none";

  // Ensure custom tip placeholder is restored
  if (!customTipInput.value) {
    customTipInput.setAttribute("placeholder", "Custom");
  }

  setResetButtonState();
}

function setResetButtonState() {
  const isBillEmpty = !billInput.value;
  const isTipEmpty =
    !Array.from(tipButtons).some((btn) => btn.classList.contains("active")) &&
    !customTipInput.value;
  const isPeopleEmpty = !peopleInput.value;
  if (isBillEmpty && isTipEmpty && isPeopleEmpty) {
    resetButton.disabled = true;
  } else {
    resetButton.disabled = false;
  }
}

// === EVENT LISTENERS === //

// Bill input
billInput.addEventListener("input", () => {
  handleBillInput();
  setResetButtonState();
});
billInput.addEventListener("keydown", function (e) {
  // Allow: Backspace, Delete, Tab, Escape, Enter, Arrow keys, Home/End, dot (if not already present)
  if (
    [46, 8, 9, 27, 13].includes(e.keyCode) ||
    // Allow: Ctrl/cmd+A/C/V/X/Z
    ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88, 90].includes(e.keyCode)) ||
    // Allow: Arrow keys, Home, End
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    billInvalidLabel.style.display = "none";
    return;
  }
  // Allow one dot for decimal
  if (e.key === "." && !this.value.includes(".")) {
    billInvalidLabel.style.display = "none";
    return;
  }
  // Block: minus, letters, and anything not 0-9 or dot
  if (
    (e.key.length === 1 && !/[0-9.]/.test(e.key)) ||
    e.key === "-" ||
    e.key === "," ||
    (e.key === "." && this.value.includes("."))
  ) {
    e.preventDefault();
    billInvalidLabel.style.display = "inline";
  } else {
    billInvalidLabel.style.display = "none";
  }
});
billInput.addEventListener("input", function () {
  if (/^\d*\.?\d*$/.test(this.value)) {
    billInvalidLabel.style.display = "none";
  }
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
  handleCustomTipInput();
  setResetButtonState();
});
customTipInput.addEventListener("focus", function () {
  this.removeAttribute("placeholder");
});
customTipInput.addEventListener("blur", function () {
  if (!this.value) this.setAttribute("placeholder", "Custom");
});
// Prevent invalid input for custom tip (only one dot, no minus, no letters)
customTipInput.addEventListener("keydown", function (e) {
  // Allow: Backspace, Delete, Tab, Escape, Enter, Arrow keys, Home/End
  if (
    [46, 8, 9, 27, 13].includes(e.keyCode) ||
    // Allow: Ctrl/cmd+A/C/V/X/Z
    ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88, 90].includes(e.keyCode)) ||
    // Allow: Arrow keys, Home, End
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    return;
  }
  // Allow one dot for decimal
  if (e.key === "." && !this.value.includes(".")) {
    return;
  }
  // Block: minus, letters, and anything not 0-9 or dot
  if (
    (e.key.length === 1 && !/[0-9.]/.test(e.key)) ||
    e.key === "-" ||
    e.key === "," ||
    (e.key === "." && this.value.includes("."))
  ) {
    e.preventDefault();
  }
});
customTipInput.addEventListener("input", function () {
  // Remove any invalid characters (allow only digits and one dot)
  let val = this.value;
  // Remove all except digits and dots
  val = val.replace(/[^0-9.]/g, "");
  // Only keep the first dot
  const parts = val.split(".");
  if (parts.length > 2) {
    val = parts[0] + "." + parts.slice(1).join("");
  }
  this.value = val;
});

// People input
peopleInput.addEventListener("input", () => {
  handlePeopleInput();
  setResetButtonState();
});
peopleInput.addEventListener("focus", function () {
  if (this.value === "1") {
    this.value = "";
  }
});
peopleInput.addEventListener("keydown", function (e) {
  // Allow: Backspace, Delete, Tab, Escape, Enter, Arrow keys, Home/End
  if (
    [46, 8, 9, 27, 13].includes(e.keyCode) ||
    // Allow: Ctrl/cmd+A/C/V/X/Z
    ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88, 90].includes(e.keyCode)) ||
    // Allow: Arrow keys, Home, End
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    peopleInvalidLabel.style.display = "none";
    return;
  }
  // Block: minus, dot, plus, letters, and anything not 0-9
  if (
    (e.key.length === 1 && !/[0-9]/.test(e.key)) ||
    e.key === "-" ||
    e.key === "." ||
    e.key === "," ||
    e.key === "+"
  ) {
    e.preventDefault();
    peopleInvalidLabel.style.display = "inline";
  } else {
    peopleInvalidLabel.style.display = "none";
  }
});
peopleInput.addEventListener("input", function () {
  // Remove any non-digit characters
  this.value = this.value.replace(/[^0-9]/g, "");
  peopleInvalidLabel.style.display = "none";
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
  resetButton.disabled = true; // Ensure disabled state after reset
});

// === INIT === //
setResetButtonState();
