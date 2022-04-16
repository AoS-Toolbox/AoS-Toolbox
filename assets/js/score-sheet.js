// Add auto-saving event listeners to all text input fields
document.querySelectorAll("input[type='text']").forEach(e => {
  e.addEventListener("change", () => {
    window.localStorage.setItem(e.id, e.value);
    console.log("Just saved value " + e.value + " to key " + e.id);
  });
});

// Add auto-saving event listeners to all checkbox fields
document.querySelectorAll("input[type='checkbox']").forEach(e => {
  e.addEventListener("change", () => {
    window.localStorage.setItem(e.id, e.checked);
    console.log("Just saved value " + e.value + " to key " + e.id);
  });
});

// Add incrementing / decrementing logic to custom number field buttons
document.querySelectorAll(".cart-plus-minus").forEach((div) => {
  const plusButton = div.querySelector(".inc");
  const minusButton = div.querySelector(".dec");
  const numBox = div.querySelector(".cart-plus-minus-box");
  
  plusButton.addEventListener("click", () => {
    numBox.value = parseInt(numBox.value) + 1;
    numBox.dispatchEvent(new Event("change"));
  });
  
  minusButton.addEventListener("click", () => {
    numBox.value = parseInt(numBox.value) - 1;
    numBox.dispatchEvent(new Event("change"));
  });
});

// Dynamically load values back into all fields, >>>> THEN UPDATE SCORES
function loadFromLocalStorage() {
  // load .values back into text fields
  document.querySelectorAll("input[type='text']").forEach(e=> {
    if (window.localStorage.getItem(e.id) != null) {
      e.value = window.localStorage.getItem(e.id);
      console.log("Just loaded in text value " + window.localStorage.getItem(e.id) + " from key " + e.id);
    }
  });
  
  // load boolean values back into checkbox fields
    document.querySelectorAll("input[type='checkbox']").forEach(e=> {
    if (window.localStorage.getItem(e.id) != null) {
      e.checked = window.localStorage.getItem(e.id);
      console.log("Just loaded in checkbox value " + window.localStorage.getItem(e.id) + " from key " + e.id);
    }
  });
}
