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
    console.log("Just saved value " + e.checked + " to key " + e.id);
  });
});

// On any change event, call updateTotals();
document.querySelectorAll("input").forEach(e => {
  e.addEventListener("change", () => {
    updateTotals();
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
  
  // Finally, call updateTotals()
  updateTotals();
}

function updateTotals() {
  let grandTotals = {
    1: 0,
    2: 0
  }
  
  // outer loop: once per player
  for (let i = 1; i < 3; i++) {
    // inner loop: once per turn, per player
    for (let j = 1; j < 6; j++) {
      let tacticScored = (el(`tacticCheckboxR${j}P${i}`).checked) ? 2 : 0;
      let withMonster = (el(`withMonsterR${j}P${i}`).checked) ? 1 : 0;
      let slainMonster = (el(`slainMonsterR${j}P${i}`).checked) ? 1 : 0;
      let objectiveVPs = parseInt(el(`objectiveVPR${j}P${i}`).value);
      
      let roundTotal = tacticScored + withMonster + slainMonster + objectiveVPs;
      grandTotals[i] += roundTotal;
      
      el(`headerR${j}P${i}`).innerText = `Round ${j} - Player ${i} - (${roundTotal})`;
      el(`vicPointsR${j}P${i}`).innerText = `VICTORY POINTS: ${roundTotal}`;
    }
    
    if (el(`grandStratP${i}`).checked) grandTotals[i] += 3;
    el(`totalPointsP${i}`).innerText = "TOTAL VICTORY POINTS: " + grandTotals[i];
  }
}

// clear game data from localStorage and refresh page
function clearGame() {
  window.localStorage.clear();
  window.location.reload();
}

function exportGame() {
  alert("This feature will be available soon.");
}

// shortened syntax for getElementById
function el(id) {
  return document.getElementById(id);
}
