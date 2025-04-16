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

let billValue = 0;
let tipValue = 0;
let peopleValue = 1;

// === EVENT LISTENERS === //
billInput.addEventListener("input", handleBillInput);
tipButtons.forEach((button) =>
  button.addEventListener("click", handleTipButtonClick)
);
customTipInput.addEventListener("input", handleCustomTipInput);
peopleInput.addEventListener("input", handlePeopleInput);
resetButton.addEventListener("click", resetCalculator);

// === FUNCTIONS === //
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
  calculateResults();
}

function handlePeopleInput() {
  peopleValue = parseInt(peopleInput.value) || 1;
  if (peopleValue <= 0) {
    peopleInput.classList.add("error");
  } else {
    peopleInput.classList.remove("error");
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
  peopleInput.value = "";
  tipAmountDisplay.textContent = "$0.00";
  totalDisplay.textContent = "$0.00";
  billValue = 0;
  tipValue = 0;
  peopleValue = 1;
}
