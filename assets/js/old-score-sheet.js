/**
Battle Tactic scored: tacticCheckboxR_P_
Scored w/ monsters: withMonsterR_P_
Monster slain: slainMonsterR_P_
Objective points: objectiveVPR_P_
Victory Points: vicPointsR_P_
Header: headerR_P_
Grand strat: grandStratP_
Total victory points: totalPointsP_
     
**/

class Player {
  constructor(num) {
      this.id = num;

      this.elements = {
        grandStrategy: document.getElementById(`grandStratP${num}`),
        totalPoints: document.getElementById(`totalPointsP${num}`)
      };

      // for e.g: player1Obj.elements.round1.tacticScored.checked
      for (let j = 1; j <= 5; j++) {
        this.elements["round" + j] = {
          priority: document.getElementById(`priority-checkbox-p${num}-r${j}`),
          wentFirst: document.getElementById(`first-turn-checkbox-p${num}-r${j}`),
          battleTactic: document.getElementById(`battleTacticR${j}P${num}`),
          tacticScored: document.getElementById(`tacticCheckboxR${j}P${num}`),
          withMonster: document.getElementById(`withMonsterR${j}P${num}`),
          slainMonster: document.getElementById(`slainMonsterR${j}P${num}`),
          objectivePoints: document.getElementById(`objectiveVPR${j}P${num}`),

          victoryPoints: document.getElementById(`vicPointsR${j}P${num}`),
          header: document.getElementById(`headerR${j}P${num}`)
        }
     }
    
     this.scores = {
      round1: null,
      round2: null,
      round3: null,
      round4: null,
      round5: null,
      grandStrat: null,
      total: null
     }
  }
  
  calcRound(roundNum) {
    let values = this.elements["round" + roundNum];
    
    // Reset score for this round
    this.scores["round" + roundNum] = 0;
    
    // Calculate score for this round
    if (values.tacticScored.checked === true) this.scores["round" + roundNum] += 2;
    if (values.withMonster.checked === true) this.scores["round" + roundNum]++;
    if (values.slainMonster.checked === true) this.scores["round" + roundNum]++;
    this.scores["round" + roundNum] += parseInt(values.objectivePoints.value);
  }

  calcTotal() {
    let score = this.scores;
    score.grandStrat = (this.elements.grandStrategy.checked === true) ? 3 : 0;
    score.total = score.round1 + score.round2 + score.round3 + score.round4 + score.round5 + score.grandStrat;
  }

  updateView() {
    for (let j = 1; j <= 5; j++) {
      // Update round headers with score
      if (this.scores["round" + j] != null) this.elements["round" + j].header.innerText = `Round ${j} - Player ${this.id} - (${this.scores["round" + j]})`;
      
      // Update Victory Points total for the given round
      if (this.scores["round" + j] != null) this.elements["round" + j].victoryPoints.innerText = `VICTORY POINTS: ${this.scores["round" + j]}`;
    }
    
    this.elements.totalPoints.innerText = "TOTAL VICTORY POINTS: " + this.scores.total;
  }
  
} // END OF PLAYER CLASS DEFINITION

const player1Obj = new Player(1);
const player2Obj = new Player(2);

// Update values on interaction with value-relevant input field
document.querySelectorAll(".totals-relevant").forEach((input) => {
  input.addEventListener("input", updateAll);
  input.addEventListener("input", updateLocalStorage);
})

// Update values when custom buttons pressed for Objective VPs
document.querySelectorAll(".cart-plus-minus").forEach((div) => {
     // div.addEventListener("click", updateAll);
     
     const plusButton = div.querySelector(".inc");
     const minusButton = div.querySelector(".dec");
     const numBox = div.querySelector(".cart-plus-minus-box");
     
     plusButton.addEventListener("click", function() {
          numBox.value = parseInt(numBox.value) + 1;
          updateAll();
          updateLocalStorage();
     });
     
     minusButton.addEventListener("click", function() {
          numBox.value = parseInt(numBox.value) - 1;
          updateAll();
          updateLocalStorage();
     });
})

function updateAll() {
  for (let i = 1; i <= 5; i++) {
    player1Obj.calcRound(i);
    player2Obj.calcRound(i);
  }
  
  player1Obj.calcTotal();
  player2Obj.calcTotal();
  
  player1Obj.updateView();
  player2Obj.updateView();
}

function createGameSummary() {
  const nameP1 = document.getElementById("player-name1").value;
  const factionP1 = document.getElementById("factionP1").value;
  const subfactionP1 = document.getElementById("subfaction1").value;
  const grandStratP1 = document.getElementById("grandStrategySelectP1").value;

  const nameP2 = document.getElementById("player-name2").value;
  const factionP2 = document.getElementById("factionP2").value;
  const subfactionP2 = document.getElementById("subfaction2").value;
  const grandStratP2 = document.getElementById("grandStrategySelectP2").value;

  function createRoundSummary(playerNum, roundNum) {
    return `
    TURN ${roundNum} - ${(playerNum === 1) ? nameP1 : nameP2}
    Priority: ${(element(`priority-checkbox-p${playerNum}-r${roundNum}`).checked) ? "YES" : "NO"}, Went First: ${(element(`first-turn-checkbox-p${playerNum}-r${roundNum}`).checked) ? "YES" : "NO"}
  
      BATTLE TACTIC: ${element(`battleTacticR${roundNum}P${playerNum}`).value} ${(element(`tacticCheckboxR${roundNum}P${playerNum}`).checked) ? "(COMPLETED)" : "(FAILED)"}
      VICTORY POINTS: ${element(`vicPointsR${roundNum}P${playerNum}`).innerText.split(':').pop()}
    `
  }

  let summaryString = `
  PLAYER 1 - ${nameP1}
  ${factionP1} (${subfactionP1})
  GRAND STRATEGY: ${grandStratP1}

  PLAYER 2 - ${nameP2}
  ${factionP2} (${subfactionP2})
  GRAND STRATEGY: ${grandStratP2} 

  ROUND 1:

  ${(element("first-turn-checkbox-p1-r1").checked) ? createRoundSummary(1, 1) : createRoundSummary(2, 1)}
  ${(!element("first-turn-checkbox-p1-r1").checked) ? createRoundSummary(1, 1) : createRoundSummary(2, 1)}

  ROUND 2:

  ${(element("first-turn-checkbox-p1-r2").checked) ? createRoundSummary(1, 2) : createRoundSummary(2, 2)}
  ${(!element("first-turn-checkbox-p1-r2").checked) ? createRoundSummary(1, 2) : createRoundSummary(2, 2)}

  ROUND 3:

  ${(element("first-turn-checkbox-p1-r3").checked) ? createRoundSummary(1, 3) : createRoundSummary(2, 3)}
  ${(!element("first-turn-checkbox-p1-r3").checked) ? createRoundSummary(1, 3) : createRoundSummary(2, 3)}

  ROUND 4:

  ${(element("first-turn-checkbox-p1-r4").checked) ? createRoundSummary(1, 4) : createRoundSummary(2, 4)}
  ${(!element("first-turn-checkbox-p1-r4").checked) ? createRoundSummary(1, 4) : createRoundSummary(2, 4)}

  ROUND 5:

  ${(element("first-turn-checkbox-p1-r5").checked) ? createRoundSummary(1, 5) : createRoundSummary(2, 5)}
  ${(!element("first-turn-checkbox-p1-r5").checked) ? createRoundSummary(1, 5) : createRoundSummary(2, 5)}

  SUMMARY:

  PLAYER 1 - ${(player1Obj.score.total > player2Obj.score.total) ? "(WINNER)" : ""}
     GRAND STRATEGY: ${(player1Obj.scores.grandStrat === 3) ? "YES" : "NO"}
     TOTAL VICTORY POINTS: ${player1Obj.scores.total}

  PLAYER 2 - ${(player2Obj.score.total > player1Obj.score.total) ? "(WINNER)" : ""}
     GRAND STRATEGY: ${(player2Obj.scores.grandStrat === 3) ? "YES" : "NO"}
     TOTAL VICTORY POINTS: ${player2Obj.scores.total}
  
  `;

  // >>> DEBUG ONLY
  console.log(summaryString);
}

// syntactic sugar
function element(id) {
  return document.getElementById(id);
}

// syntactic sugar / console reporting
function setItem(key, value) {
     window.localStorage.setItem(key, value);
     //console.log("Added value " + value + " to key " + key);
}

// syntactic sugar / console reporting
function getItem(key) {
     let value = window.localStorage.getItem(key);
     //console.log("Just fetched value " + value + " from key " + key);
     return value;
}

function loadFromLocalStorage() {
     /** PLAYER 1 LOAD FROM LOCAL STORAGE **/
     
     // LOAD PLAYER 1 SETUP
     document.getElementById("player-name1").value = window.localStorage.getItem("player-name1");
     document.getElementById("factionP1").value = window.localStorage.getItem("factionP1");
     document.getElementById("subfaction1").value = window.localStorage.getItem("subfaction1");
     document.getElementById("grandStrategySelectP1").value = window.localStorage.getItem("grandStrategySelectP1");
     
     // LOAD PLAYER 1 TURNS
     for (let i = 1; i < 6; i++) {
          // player1Obj.elements[`round${i}`].priority.checked = getItem(`priorityP1R${i}`) ?? false;
          // player1Obj.elements[`round${i}`].wentFirst.checked = getItem(`wentFirstP1R${i}`) ?? false;
          // player1Obj.elements[`round${i}`].battleTactic.value = getItem(`battleTacticP1R${i}`) ?? "";
          // player1Obj.elements[`round${i}`].tacticScored.checked = getItem(`tacticScoredP1R${i}`) ?? false;
          // player1Obj.elements[`round${i}`].withMonster.checked = getItem(`withMonsterP1R${i}`) ?? false;
          // player1Obj.elements[`round${i}`].slainMonster.checked = getItem(`slainMonsterP1R${i}`) ?? false;
          // player1Obj.elements[`round${i}`].objectivePoints.value = getItem(`objectivePointsP1R${i}`) ?? 0;
          // player1Obj.elements[`round${i}`].victoryPoints.value = getItem(`victoryPointsP1R${i}`) ?? "Victory Points: 0";
          
          if (window.localStorage.getItem(`priorityR${i}P1`) != null) player1Obj.elements[`round${i}`].priority.checked = getItem(`priorityR${i}P1`);
          if (window.localStorage.getItem(`wentFirstR${i}P1`) != null) player1Obj.elements[`round${i}`].wentFirst.checked = getItem(`wentFirstR${i}P1`);
          if (window.localStorage.getItem(`battleTacticR${i}P1`) != null) player1Obj.elements[`round${i}`].battleTactic.value = getItem(`battleTacticR${i}P1`);
          if (window.localStorage.getItem(`tacticScoredR${i}P1`) != null) player1Obj.elements[`round${i}`].tacticScored.checked = getItem(`tacticScoredR${i}P1`);
          if (window.localStorage.getItem(`withMonsterR${i}P1`) != null) player1Obj.elements[`round${i}`].withMonster.checked = getItem(`withMonsterR${i}P1`);
          if (window.localStorage.getItem(`slainMonsterR${i}P1`) != null) player1Obj.elements[`round${i}`].slainMonster.checked = getItem(`slainMonsterR${i}P1`);
          if (window.localStorage.getItem(`objectivePointsR${i}P1`) != null) player1Obj.elements[`round${i}`].objectivePoints.value = getItem(`objectivePointsR${i}P1`);
          if (window.localStorage.getItem(`victoryPointsR${i}P1`) != null) player1Obj.elements[`round${i}`].victoryPoints.value = getItem(`victoryPointsR${i}P1`);
     }
     
     
     /** PLAYER 2 LOAD FROM LOCAL STORAGE **/
     
     // LOAD PLAYER 2 SETUP
     document.getElementById("player-name2").value = window.localStorage.getItem("player-name2");
     document.getElementById("factionP2").value = window.localStorage.getItem("factionP2");
     document.getElementById("subfaction2").value = window.localStorage.getItem("subfaction2");
     document.getElementById("grandStrategySelectP2").value = window.localStorage.getItem("grandStrategySelectP2");
     
     /** AFTER FIELDS RE-FILLED, UPDATE SCORES IN PLAYER OBJECTS **/
     updateAll();
}

function updateLocalStorage() {
     /** PLAYER 1 OUTPUT TO LOCAL STORAGE **/
     
     // SAVE PLAYER 1 SETUP
     window.localStorage.setItem("player-name1", document.getElementById("player-name1").value);
     window.localStorage.setItem("factionP1", document.getElementById("factionP1").value);
     window.localStorage.setItem("subfaction1", document.getElementById("subfaction1").value);
     window.localStorage.setItem("grandStrategySelectP1", document.getElementById("grandStrategySelectP1").value);
     
     // SAVE PLAYER 1 TURNS
     for (let i = 1; i < 6; i++) {
          setItem(`priorityR${i}P1`, player1Obj.elements[`round${i}`].priority.checked);
          console.log("Just set storage priorityR${i}P1 to value " + player1Obj.elements[`round${i}`].priority.checked); // DEBUG
          setItem(`wentFirstR${i}P1`, player1Obj.elements[`round${i}`].wentFirst.checked);
          setItem(`battleTacticR${i}P1`, player1Obj.elements[`round${i}`].battleTactic.value);
          setItem(`tacticScoredR${i}P1`, player1Obj.elements[`round${i}`].tacticScored.checked);
          setItem(`withMonsterR${i}P1`, player1Obj.elements[`round${i}`].withMonster.checked);
          setItem(`slainMonsterR${i}P1`, player1Obj.elements[`round${i}`].slainMonster.checked);
          setItem(`objectivePointsR${i}P1`, player1Obj.elements[`round${i}`].objectivePoints.value);
          setItem(`victoryPointsR${i}P1`, player1Obj.elements[`round${i}`].victoryPoints.value);
     }
     
     /** PLAYER 2 OUTPUT TO LOCAL STORAGE **/
     
     // SAVE PLAYER 2 SETUP
     window.localStorage.setItem("player-name2", document.getElementById("player-name2").value);
     window.localStorage.setItem("factionP2", document.getElementById("factionP2").value);
     window.localStorage.setItem("subfaction2", document.getElementById("subfaction2").value);
     window.localStorage.setItem("grandStrategySelectP2", document.getElementById("grandStrategySelectP2").value);
}
