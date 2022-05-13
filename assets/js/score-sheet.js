// Add auto-saving event listeners to all text input fields
document.querySelectorAll("input[type='text']").forEach(e => {
  e.addEventListener("change", () => {
    window.localStorage.setItem(e.id, e.value);
    console.log("Just saved value " + e.value + " to key " + e.id);
    if (e.id.indexOf("-mobile") != -1) {
      const desktopID = e.id.replace("-mobile", "");
      const desktopEl = document.getElementById(desktopID);
      
      desktopEl.value = e.value;
      window.localStorage.setItem(desktopEl.id, desktopEl.value);
      console.log("Just saved value " + desktopEl.value + " to key " + desktopEl.id);
    } else {
      const mobileID = e.id + "-mobile";
      const mobileEl = document.getElementById(mobileID);
      
      mobileEl.value = e.value;
      window.localStorage.setItem(mobileEl.id, mobileEl.value);
      console.log("Just saved value " + mobileEl.value + " to key " + mobileEl.id); 
    };
  });
});

// Add auto-saving event listeners to all checkbox fields
document.querySelectorAll("input[type='checkbox']").forEach(e => {
  e.addEventListener("change", () => {
    window.localStorage.setItem(e.id, e.checked);
    console.log("Just saved value " + e.checked + " to key " + e.id);
    if (e.id.indexOf("-mobile") != -1) {
      const desktopID = e.id.replace("-mobile", "");
      const desktopEl = document.getElementById(desktopID);
      
      desktopEl.checked = e.checked;
      window.localStorage.setItem(desktopEl.id, desktopEl.checked);
      console.log("Just saved value " + desktopEl.checked + " to key " + desktopEl.id);
    } else {
      const mobileID = e.id + "-mobile";
      const mobileEl = document.getElementById(mobileID);
      
      mobileEl.checked = e.checked;
      window.localStorage.setItem(mobileEl.id, mobileEl.checked);
      console.log("Just saved value " + mobileEl.checked + " to key " + mobileEl.id);
    };
  });
});

// Add auto-saving event listeners to all drop-down fields
document.querySelectorAll("select").forEach(e => {
  e.addEventListener("change", () => {
    window.localStorage.setItem(e.id, e.value);
    console.log("Just saved drop-down value " + e.value + " to key " + e.id);
    updateTotals();
    if (e.id.indexOf("-mobile") != -1) {
      const desktopID = e.id.replace("-mobile", "");
      const desktopEl = document.getElementById(desktopID);
      
      desktopEl.value = e.value;
      window.localStorage.setItem(desktopEl.id, desktopEl.value);
      console.log("Just saved value " + desktopEl.value + " to key " + desktopEl.id);
    } else {
      const mobileID = e.id + "-mobile";
      const mobileEl = document.getElementById(mobileID);
      
      mobileEl.value = e.value;
      window.localStorage.setItem(mobileEl.id, mobileEl.value);
      console.log("Just saved value " + mobileEl.value + " to key " + mobileEl.id); 
    };
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
  document.querySelectorAll("input[type='text']").forEach(e => {
    if (window.localStorage.getItem(e.id) != null) {
      e.value = window.localStorage.getItem(e.id);
      console.log("Just loaded in text value " + window.localStorage.getItem(e.id) + " from key " + e.id);
    }
  });
  
  // load boolean values back into checkbox fields
  document.querySelectorAll("input[type='checkbox']").forEach(e => {
    if (window.localStorage.getItem(e.id) != null) {
      e.checked = window.localStorage.getItem(e.id);
      console.log("Just loaded in checkbox value " + window.localStorage.getItem(e.id) + " from key " + e.id);
    }
  });
  
  // load values into drop-down fields
  document.querySelectorAll("select").forEach(e => {
    if (window.localStorage.getItem(e.id) != null) {
      e.value = window.localStorage.getItem(e.id);
      console.log("Just loaded in drop-down value " + window.localStorage.getItem(e.id) + " from key " + e.id);
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
  
  // outer loop: once per player (desktop view)
  for (let i = 1; i < 3; i++) {
    // inner loop: once per turn, per player
    for (let j = 1; j < 6; j++) {
      let tacticScored = (el(`tacticCheckboxR${j}P${i}`).checked) ? 2 : 0;
      let withMonster = (el(`withMonsterR${j}P${i}`).checked) ? 1 : 0;
      let slainMonster = (el(`slainMonsterR${j}P${i}`).checked) ? 1 : 0;
      let objectiveVPs = parseInt(el(`objectiveVPR${j}P${i}`).value);
      
      let roundTotal = tacticScored + withMonster + slainMonster + objectiveVPs;
      grandTotals[i] += roundTotal;
      
      el(`headerR${j}P${i}`).innerText = `Player ${i} - Round ${j} - (${roundTotal})`;
      el(`vicPointsR${j}P${i}`).innerText = `VICTORY POINTS: ${roundTotal}`;
    }
    
    if (el(`grandStratP${i}`).checked) grandTotals[i] += 3;
    el(`totalPointsP${i}`).innerText = "TOTAL VICTORY POINTS: " + grandTotals[i];
  }

  // outer loop: once per player (mobile view)
  for (let i = 1; i < 3; i++) {
    // inner loop: once per turn, per player
    for (let j = 1; j < 6; j++) {
      let tacticScored = (el(`tacticCheckboxR${j}P${i}-mobile`).checked) ? 2 : 0;
      let withMonster = (el(`withMonsterR${j}P${i}-mobile`).checked) ? 1 : 0;
      let slainMonster = (el(`slainMonsterR${j}P${i}-mobile`).checked) ? 1 : 0;
      let objectiveVPs = parseInt(el(`objectiveVPR${j}P${i}-mobile`).value);
      
      let roundTotal = tacticScored + withMonster + slainMonster + objectiveVPs;
      grandTotals[i] += roundTotal;
      
      el(`headerR${j}P${i}-mobile`).innerText = `Player ${i} - Round ${j} - (${roundTotal})`;
      el(`vicPointsR${j}P${i}-mobile`).innerText = `VICTORY POINTS: ${roundTotal}`;
    }
    
    if (el(`grandStratP${i}-mobile`).checked) grandTotals[i] += 3;
    el(`totalPointsP${i}-mobile`).innerText = "TOTAL VICTORY POINTS: " + grandTotals[i];
  }
}

// clear game data from localStorage and refresh page
function clearGame() {
  window.localStorage.clear();
  window.location.reload();
}

function exportGame() {
  // ensure that all turn orders and battle tactics have been inputted before exporting a
  // game summary. if not, direct user to complete these fields.
  if (getUnreportedFields("turn order").length === 0 && getUnreportedFields("tactics").length === 0) {
    alert(createGameSummary());
  } else if (getUnreportedFields("turn order").length != 0) {
    alert("Please indicate which player took first turn in each round.\n\nTurns outstanding: " + getUnreportedFields("turn order"));
  } else if (getUnreportedFields("tactics").length != 0) {
    alert("Please complete missing battle tactics.\n\nTurns outstanding: " + getUnreportedFields("tactics"));
  }
}

function createGameSummary() {
  return `
  ${el("player-name1").value} - ${el("factionP1").value}, ${el("grandStrategySelectP1").value}
  ${el("player-name2").value} - ${el("factionP2").value}, ${el("grandStrategySelectP2").value}
  
  ${(el("first-turn-checkbox-p1-r1").checked) ? createRoundSummary(1, 1) : createRoundSummary(2, 1)}
  ${(!el("first-turn-checkbox-p1-r1").checked) ? createRoundSummary(1, 1) : createRoundSummary(2, 1)}
  
  ${(el("first-turn-checkbox-p1-r2").checked) ? createRoundSummary(1, 2) : createRoundSummary(2, 2)}
  ${(!el("first-turn-checkbox-p1-r2").checked) ? createRoundSummary(1, 2) : createRoundSummary(2, 2)}
  
  ${(el("first-turn-checkbox-p1-r3").checked) ? createRoundSummary(1, 3) : createRoundSummary(2, 3)}
  ${(!el("first-turn-checkbox-p1-r3").checked) ? createRoundSummary(1, 3) : createRoundSummary(2, 3)}
  
  ${(el("first-turn-checkbox-p1-r4").checked) ? createRoundSummary(1, 4) : createRoundSummary(2, 4)}
  ${(!el("first-turn-checkbox-p1-r4").checked) ? createRoundSummary(1, 4) : createRoundSummary(2, 4)}
  
  ${(el("first-turn-checkbox-p1-r5").checked) ? createRoundSummary(1, 5) : createRoundSummary(2, 5)}
  ${(!el("first-turn-checkbox-p1-r5").checked) ? createRoundSummary(1, 5) : createRoundSummary(2, 5)}
  
  GRAND STRATS: ${el("player-name1").value} ${(el("grandStratP1").checked) ? "✓" : "✗"}, ${el("player-name2").value} ${(el("grandStratP2").checked) ? "✓" : "✗"}
  
  ${getWinner()}
  `
}

function createRoundSummary(player, round) {
  return `${el("player-name" + player).value} T${round}: (${el("battleTacticR" + round + "P" + player).value.slice(0, 9) + "."}) ${(el("tacticCheckboxR" + round + "P" + player).checked) ? "✓" : "✗"} - ${el("vicPointsR" + round + "P" + player).innerText.split(": ")[1]}` 
}

function getWinner() {
  let player1Score = parseInt(el("totalPointsP1").innerText.split(": ")[1]);
  let player2Score = parseInt(el("totalPointsP2").innerText.split(": ")[1]);
  
  if (player1Score === player2Score) {
    return `DRAW: ${player1Score} - ${player2Score}`;
  } else if (player1Score > player2Score) {
    return `WINNER: ${el("player-name1").value}, ${player1Score} - ${player2Score}`;
  } else {
    return `WINNER: ${el("player-name2").value}, ${player2Score} - ${player1Score}`;
  }
}

function getUnreportedFields(field) {
  let rounds = [];
  
  for (let i = 0; i < 5; i++) {
    if (field === "turn order") {

      // equals false if neither player has Went First ticked in the given round
      let roundStatus = ((el("first-turn-checkbox-p1-r" + (i + 1)).checked && !el("first-turn-checkbox-p2-r" + (i + 1)).checked) || 
      (el("first-turn-checkbox-p2-r" + (i + 1)).checked && !el("first-turn-checkbox-p1-r" + (i + 1)).checked));

      if (roundStatus === false) {
        rounds.push(i + 1);
      }

    } else if (field === "tactics") {

      // equals false if either player in the round did not input their Battle Tactic
      let tacticsStatus = el("battleTacticR" + (i + 1) + "P1").value !== "" && el("battleTacticR" + (i + 1) + "P2").value !== "";
      if (tacticsStatus === false) {
        rounds.push(i + 1);
      }

    }
  }
  
  // if any rounds include false, return false, else return true
  return rounds;
}
  
// shortened syntax for getElementById
function el(id) {
  return document.getElementById(id);
}
