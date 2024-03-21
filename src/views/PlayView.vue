<template>
  <div>
    <div>
      <div class="title-container">
        <h1>Playing Page</h1>
      </div>
      <div class="player-names">
        <div
          :class="{ 'current-player': currentPlayer === 'Player 1' }"
          class="player1-name"
        >
          {{ player1 }}
        </div>
        <div
          :class="{ 'current-player': currentPlayer === 'Player 2' }"
          class="player2-name"
        >
          {{ player2 }}
        </div>
      </div>
      <div class="board-container">
        <div
          v-for="(row, rowIndex) in 9"
          :key="rowIndex"
          class="board-row"
          :style="{ marginTop: rowIndex % 2 === 0 ? '-1vw' : '-1vw' }"
        >
          <div
            v-for="(cell, cellIndex) in 18"
            :key="cellIndex"
            class="board-cell"
            :class="{ 'even-row': rowIndex % 2 === 0 }"
            @click="changeColor(rowIndex, cellIndex)"
          >
            <!-- You can customize the content of each cell as needed -->
            <!-- For now, let's just remove the numbers -->
          </div>
        </div>
      </div>
    </div>
    <!-- Wrap the button in a div for centering -->
    <div class="button-wrapper">
      <button class="end-turn-button" @click="endTurn">End Turn</button>
    </div>
    <div class="timer">Time left: {{ timer }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPlayer: "Player 1", // Initialize currentPlayer to "Player 1"
      player1: "",
      player2: "",

      timer: 30,
      timerInterval: null,
    };
  },
  mounted() {
    // Retrieve player names from route query parameters
    this.player1 = this.$route.query.player1 || "Player 1";
    this.player2 = this.$route.query.player2 || "Player 2";
    this.startTimer();
  },
  methods: {
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.endTurn();
        }
      }, 1000);
    },
    resetTimer() {
      clearInterval(this.timerInterval);
      this.timer = 30;
      this.startTimer();
    },
    changeColor(rowIndex, cellIndex) {
      console.log(`Box clicked: (${rowIndex}, ${cellIndex})`);
      const cell = document.querySelector(
        `.board-row:nth-child(${rowIndex + 1}) .board-cell:nth-child(${
          cellIndex + 1
        })`
      );
      if (cell) {
        if (this.currentPlayer === "Player 1") {
          // Check if it's player 1's turn
          cell.style.backgroundColor = "red";
        } else {
          cell.style.backgroundColor = "blue";
        }
      }
    },
    endTurn() {
      clearInterval(this.timerInterval);
      // Switch between players
      this.currentPlayer =
        this.currentPlayer === "Player 1" ? "Player 2" : "Player 1";
      // Reset timer
      this.resetTimer();
    },
  },
};
</script>

<style scoped>
.title-container {
  text-align: center; /* Center align the content horizontally */
}
.player-names {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 30px;
}

.player1-name,
.player2-name {
  font-size: 24px;
  padding: 5px 10px;
  border: 2px solid transparent;
}

.current-player {
  font-size: 30px;
  border-color: rgb(115, 255, 0);
}

.player1-name {
  color: red;
}

.player2-name {
  color: blue;
}

.board-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center the grid horizontally */
  align-items: center; /* Center the grid vertically */
  margin-top: 20px;
}

.board-row {
  display: flex;
}

.board-cell {
  width: 4vw; /* Relative width */
  height: calc(4vw * 1.18); /* Aspect ratio for hexagon */
  background-color: #ccc;
  position: relative;
  margin: 0.05vw; /* Relative margin */
  display: flex;
  justify-content: center;
  align-items: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.even-row {
  transform: translateX(50%); /* Adjust horizontal positioning */
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.end-turn-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.end-turn-button:hover {
  background-color: #0056b3;
}

.timer {
  text-align: center;
  margin-top: 10px;
}
</style>
