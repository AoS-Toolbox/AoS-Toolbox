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
  
  for (let j = 1; j <= 5; i++) {
    playerObj["round" + j] = {
      tacticScored: document.getElementById(`tacticCheckboxR${j}P${i}`),
      withMonster: document.getElementById(`withMonsterR${j}P${i}`),
      slainMonster: document.getElementById(`slainMonsterR${j}P${i}`),
      objectivePoints: null,
      
      victoryPoints: null,
      header: null
    }
  }
  
  playerObj["scores"] = {
      round1: null,
      round2: null,
      round3: null,
      round4: null,
      round5: null,
      grandStrat: null,
      total: null
    }
  
  playerObj.calcRound = (round) => {
    // calculate score for a given round
    // (this logic should return raw value, no side effects)
  }
  
  playerObj.calcTotal = () => {
    // calculate score for whole game
    // (this logic should return raw value, no side effects)
  }
}
