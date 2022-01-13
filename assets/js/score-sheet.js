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

// PLAYER OBJECTS
let player1Obj = {};
let player2Obj = {};

// Define each player object, including DOM elements
for (let i = 1; i <= 2; i++) {
  let playerObj = (i === 1) ? player1Obj : player2Obj;
  
  playerObj.id = i;
  
  playerObj.elements = {
    grandStrategy: document.getElementById(`grandStratP${i}`),
    totalPoints: document.getElementById(`totalPointsP${i}`)
  };
  
  for (let j = 1; j <= 5; i++) {
    playerObj.elements["round" + j] = {
      tacticScored: document.getElementById(`tacticCheckboxR${j}P${i}`),
      withMonster: document.getElementById(`withMonsterR${j}P${i}`),
      slainMonster: document.getElementById(`slainMonsterR${j}P${i}`),
      objectivePoints: document.getElementById(`objectiveVPR${j}P${i}`),
      
      victoryPoints: document.getElementById(`vicPointsR${j}P${i}`),
      header: document.getElementById(`headerR${j}P${i}`)
    }
  }
  
  playerObj.scores = {
      round1: null,
      round2: null,
      round3: null,
      round4: null,
      round5: null,
      grandStrat: null,
      total: null
  }
  
  playerObj.calcRound = (roundNum) => {
    let values = this.elements["round" + roundNum];
    
    // Reset score for this round
    this.scores.round1 = 0;
    
    // Calculate score for this round
    if (values.tacticScored.checked === true) this.scores.round1 += 2;
    if (values.withMonster.checked === true) this.scores.round1++;
    if (values.slainMonster.checked === true) this.scores.round1++;
    if (values.objectivePoints.value > 0) this.scores.round1 += values.objectivePoints.value;
  }
  
  playerObj.calcTotal = () => {
    let score = this.scores;
    score.grandStrat = (this.elements.grandStrategy.checked === true) ? 3 : 0;
    score.total = score.round1 + score.round2 + score.round3 + score.round4 + score.round5 + score.grandStrat;
  }
  
  playerObj.updateView = () => {
    for (let j = 1; j <= 5; j++) {
      // Update round headers with score
      if (this.scores["round" + j] != null) this.elements["round" + j].header.innerText = `Round ${j} - Player ${this.id}: (${this.scores["round" + j]})`;
      
      // Update Victory Points total for the given round
      if (this.scores["round" + j] != null) this.elements["round" + j].victoryPoints.innerText = `VICTORY POINTS: ${this.scores["round" + j]}`;
    }
    
    this.elements.totalPoints.innerText = this.scores.total;
  }
}

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
