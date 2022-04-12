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

      for (let j = 1; j <= 5; j++) {
        this.elements["round" + j] = {
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
    
    console.log("Round " + roundNum + ", Player " + this.id + ": scored " + this.scores["round" + roundNum]);
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
  
}

const player1Obj = new Player(1);
const player2Obj = new Player(2);

// Update values on interaction with value-relevant input field
document.querySelectorAll(".totals-relevant").forEach((input) => {
  input.addEventListener("input", updateAll);
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
     });
     
     minusButton.addEventListener("click", function() {
          numBox.value = parseInt(numBox.value) - 1;
          updateAll();
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

  PLAYER 1 -
  GRAND STRATEGY: ${(player1Obj.scores.grandStrat === 3) ? "YES" : "NO"};
  TOTAL VICTORY POINTS: ${player1Obj.scores.total}

  PLAYER 2 -
  GRAND STRATEGY: ${(player2Obj.scores.grandStrat === 3) ? "YES" : "NO"};
  TOTAL VICTORY POINTS: ${player2Obj.scores.total}
  
  `;

  // >>> DEBUG ONLY
  console.log(summaryString);
}

function element(id) {
  return document.getElementById(id);
}
