/**

Battle Tactic scored: tacticCheckboxR?P?
Scored w/ monsters: withMonsterR?P?
Monster slain: slainMonsterR?P?
Objective points: ??? objectiveVPR?P?

Victory Points: vicPointsR?P?
Header: headerR?P?

Grand strat: grandStratP?
Total victory points: totalPointsP?

********

- Programmatically add event listeners to each value-adding input
- On change, update round totals, overall totals and headers
        - When event triggered, first call totals updating functions on both
        player objects. Then use the latest totals for displaying
        
*/

// PLAYER OBJECTS
let player1Obj = {};
let player2Obj = {};

// Define each player object, including DOM elements
for (let i = 1; i <= 2; i++) {
  let playerObj = (i === 1) ? player1Obj : player2Obj;
  
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
    // calculate score for whole game, incl. grand strat, and update in playerObj.scores
  }
  
  playerObj.updateView = () => {
    // 
  }
}

function updateAll() {
  // -> Run calcRound() on each player, for all 5 rounds (providing a 1-5 int as argument)
  // -> Run calcTotal() on each player
  // -> Run updateView() on each player
}
