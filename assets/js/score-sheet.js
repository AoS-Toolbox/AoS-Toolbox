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
    if (values.objectivePoints.value > 0) this.scores["round" + roundNum] += parseInt(values.objectivePoints.value);
    
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
document.querySelectorAll(".totals-relevant").forEach((input) => {
  input.addEventListener("input", updateAll);
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
