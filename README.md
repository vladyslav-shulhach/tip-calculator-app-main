# Frontend Mentor - Tip calculator app solution

This is a solution to the [Tip calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/tip-calculator-app-ugJNGbJUX). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Calculate the correct tip and total cost of the bill per person
- Test writing incorrect input to see error messages

### Screenshot

![](./preview.png)

### Links

- Solution URL: [here](https://your-solution-url.com)
- Live Site URL: [here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- SCSS (Sass) with BEM and modular structure
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (ES6+)
- Accessibility best practices (aria-live, input validation)

### What I learned

#### Structuring JavaScript for clarity and modularity

In this project, I focused on organising JavaScript logic into small, reusable functions and attaching event listeners that handle all key user interactions. Each function has a clear purpose, whether it's validating inputs, updating state or recalculating results. This makes the codebase easier to maintain and extend. This modular approach is clearly the best way to reduce side effects and keep responsibilities clearly separated.

#### Designing robust numeric input validation

To ensure clean and accurate data input, particularly for numeric fields such as 'bill', 'tip' and 'number of people', I developed a utility function called `filterNumericInput`. This filters out all non-numeric characters and can optionally allow a single decimal point. This function guarantees that the app will always receive valid numeric values, regardless of how the user interacts with the input fields.

```javascript
function filterNumericInput(value, allowDecimal = false) {
  let filtered = value.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, "");
  if (allowDecimal) {
    const parts = filtered.split(".");
    if (parts.length > 2) filtered = parts[0] + "." + parts.slice(1).join("");
  }
  return filtered;
}
```

However, relying on input filtering alone is not enough, since users can still paste or type in invalid characters. That's why I also implemented comprehensive input event listeners.

#### Handling real-time validation with event listeners

The app's input fields have event listeners for multiple events, including `input`, `keydown`, `focus` and `blur`, which allows for precise control over user behaviour and feedback.

- **Bill input**:

  - `input`: Updates internal state and triggers recalculation.
  - `keydown`: Prevents invalid characters and multiple decimal points.
  - Error label is shown for invalid characters and hidden upon correction.

- **Tip buttons**:

  - `click`: Sets the tip percentage, deactivates the custom tip, updates the UI, and recalculates.

- **Custom tip input**:

  - `input`: Filters input to digits and one dot, updates tip, recalculates.
  - `focus` / `blur`: Handles placeholder UX.
  - `keydown`: Blocks non-numeric characters and multiple dots.

- **People input**:

  - `input`: Filters digits, removes leading zeros, updates state, and validates zero input.
  - `focus`: Clears input for easier editing.
  - `keydown`: Blocks invalid characters, shows error if needed.

- **Placeholder logic**:

  - Ensures placeholders are removed on input and restored when cleared.

- **Reset button**:

  - `click`: Clears all inputs and UI states, restoring the calculator to its default state.

This combination of filtering and event listeners provides a smooth, interactive experience and prevents invalid inputs from reaching the calculation logic.

#### Creating dynamic error messages for better feedback

To improve usability, I created inline error labels for each relevant input field and updated them dynamically based on validation outcomes. For example:

- Entering letters in numeric fields shows "Only numbers allowed."
- Entering `0` for people shows "Can't be zero."

These labels update or hide in real time as the user corrects input, reducing confusion and helping users fix mistakes immediately.

#### Improving accessibility with `aria-live` regions

To support users relying on assistive technologies, I added `aria-live="polite"` to all error message containers. This ensures that screen readers announce validation feedback without requiring users to navigate away from the input field.

```html
<span class="people__error-label" aria-live="polite"></span>
<span class="bill__invalid-label" aria-live="polite"></span>
```

#### Managing reset logic and UI state intelligently

To avoid clutter and improve clarity, I made the reset button only active when at least one field is filled or changed. This involved checking the state of the bill, tip, and people inputs dynamically.

```javascript
function setResetButtonState() {
  const isBillEmpty = !billInput.value;
  const isTipEmpty =
    !Array.from(tipButtons).some((btn) => btn.classList.contains("active")) &&
    !customTipInput.value;
  const isPeopleEmpty = !peopleInput.value;
  resetButton.disabled = isBillEmpty && isTipEmpty && isPeopleEmpty;
}
```

This makes sure that the reset option only appears when needed and keeps the interface clean.

### Continued development

- Further accessibility improvements (keyboard navigation, focus management)
- More unit tests for input validation logic
- Animations for error messages and UI transitions

## Author

- Frontend Mentor - [Vladyslav Shulhach](https://www.frontendmentor.io/profile/vladyslav-shulhach)
