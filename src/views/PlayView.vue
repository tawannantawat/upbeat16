<template>
  <div class="container">
    <div
      :class="{
        'custom-cursor': attacking.state,
        'nm-cursor': !attacking.state,
      }"
    >
      <div>
        <div class="title-container">
          <h1 class="game-title">UPBEAT</h1>
        </div>
        <div class="player-names">
          <div>
            <div class="status1-bar">
              <div
                :class="{ 'current-player': currentPlayer === 'Player 1' }"
                class="player1-name"
              >
                {{ player1 }}
              </div>
              <div>Budget: {{ player1Data.budget }}</div>
              <div>
                Main City:
                {{ player1Data.mainCity[0] }},{{ player1Data.mainCity[1] }}
              </div>
            </div>
          </div>
          <div>
            <div class="status2-bar">
              <div
                :class="{ 'current-player': currentPlayer === 'Player 2' }"
                class="player2-name"
              >
                {{ player2 }}
              </div>
              <div>Budget: {{ player2Data.budget }}</div>
              <div>
                Main City: {{ player2Data.mainCity[0] }},{{
                  player2Data.mainCity[1]
                }}
              </div>
            </div>
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
              :class="{
                'even-row': rowIndex % 2 === 0,
                'hovered-cell': isHovered(rowIndex, cellIndex),
              }"
              @click="clickedBox(rowIndex, cellIndex)"
              @mouseenter="hoverCell(rowIndex, cellIndex)"
              @mouseleave="unhoverCell"
            ></div>
          </div>
        </div>
      </div>
      <div class="button-wrapper">
        <button class="end-turn-button" @click="endTurn">End Turn</button>
      </div>
      <div class="timer">Time left: {{ timer }}</div>
      <!-- Dropdown menu -->
      <div
        v-if="showDropdown"
        class="dropdown-menu"
        :style="{
          top: dropdownPosition.top + 'px',
          left: dropdownPosition.left + 'px',
        }"
      >
        <select v-model="selectedAction">
          <option value="attack">Attack</option>
          <option value="relocate">Relocate</option>
          <option value="buy">Buy This Region</option>
        </select>
        <button @click="executeAction">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      attacking: { city1: [], city2: [], state: false },
      board: Array.from({ length: 9 }, () =>
        Array(18).fill({ owner: null, value: null })
      ),
      currentPlayer: "Player 1",
      player1: "",
      player2: "",
      player1Data: {
        budget: 0,

        mainCity: [],
      },
      player2Data: {
        budget: 0,

        mainCity: [],
      },
      timer: 30,
      timerInterval: null,
      showDropdown: false,
      dropdownPosition: { top: 0, left: 0 },
      selectedAction: null,
      hoveredRowIndex: null,
      hoveredCellIndex: null,
    };
  },
  mounted() {
    this.player1 = this.$route.query.player1 || "Player 1";
    this.player2 = this.$route.query.player2 || "Player 2";
    this.startTimer();

    const callApi = async () => {
      try {
        const getResponse = await axios.get(
          "http://localhost:8080/RandomContinent/Get"
        );
        this.player1 = getResponse.data.player1.name;
        this.player2 = getResponse.data.player2.name;
        this.player1Data.mainCity = getResponse.data.player1.continent;
        this.player2Data.mainCity = getResponse.data.player2.continent;
        this.player1Data.budget = getResponse.data.player1.money;
        this.player2Data.budget = getResponse.data.player2.money;

        this.changeColorStr(
          this.player1Data.mainCity[1],
          this.player1Data.mainCity[0]
        );
        this.endTurnStr();
        this.changeColorStr(
          this.player2Data.mainCity[1],
          this.player2Data.mainCity[0]
        );
        this.endTurnStr();

        console.log("GET request successful:", getResponse.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    callApi();
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
      this.timer = 3000;
      this.startTimer();
    },
    clickedBox(rowIndex, cellIndex) {
      if (this.attacking.state == true) {
        const cell = [cellIndex, rowIndex];
        this.attacking.city2 = cell;
        console.log(this.currentPlayer);
        const payload = {
          myRegion: this.attacking.city1,
          attackRegion: this.attacking.city2,
        };
        axios
          .post(
            `http://localhost:8080/RandomContinent/AttackRegion?player=${this.currentPlayer}`,
            payload
          )
          .then((res) => {
            if (res.status == 200) {
              if (this.currentPlayer === "Player 1") {
                var size = res.data.length;
                const cellElement = document.querySelector(
                  `.board-row:nth-child(${
                    res.data[size - 1].coordinates[1] + 1
                  }) .board-cell:nth-child(${
                    res.data[size - 1].coordinates[0] + 1
                  })`
                );
                if (cellElement) {
                  cellElement.style.backgroundColor = "#ffc0cb"; // Pink pastel
                  cellElement.innerHTML = res.data[size - 1].power;
                }
                alert("Attack Success!!!!!!!!!!");
                console.log(this.player2Data.mainCity);
                console.log(res.data[size - 1].coordinates);
                if (
                  res.data[size - 1].coordinates.toString() ==
                  this.player2Data.mainCity.toString()
                ) {
                  alert("Victory!!!!!!");
                  this.setWinner();
                  this.$router.push("/end");
                }
              }
              if (this.currentPlayer === "Player 2") {
                var size = res.data.length;
                const cellElement = document.querySelector(
                  `.board-row:nth-child(${
                    res.data[size - 1].coordinates[1] + 1
                  }) .board-cell:nth-child(${
                    res.data[size - 1].coordinates[0] + 1
                  })`
                );
                if (cellElement) {
                  cellElement.style.backgroundColor = "#82aeff"; // Blue pastel
                  cellElement.innerHTML = res.data[size - 1].power;
                }
                alert("Attack Success!!!!!!!!!!");
                if (
                  res.data[size - 1].coordinates.toString() ==
                  this.player1Data.mainCity.toString()
                ) {
                  alert("Victory!!!!!!");
                  this.setWinner();
                  this.$router.push("/end");
                }
              }
            }
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
            alert(e.response.data);
          });
        console.log();
        console.log(`${this.attacking.city1} vs ${this.attacking.city2}`);
        this.attacking.state = false;
        this.attacking.city1 = [];
        this.attacking.city2 = [];
      } else {
        console.log(`Box clicked: ( ${cellIndex},${rowIndex})`);
        // Store selected cell's row and column index
        this.selectedCell = { row: rowIndex, col: cellIndex };
        // Show dropdown menu on cell click
        this.showDropdown = true;
        // Calculate dropdown position based on cell clicked
        const cell = document.querySelector(
          `.board-row:nth-child(${rowIndex + 1}) .board-cell:nth-child(${
            cellIndex + 1
          })`
        );
        if (cell) {
          const rect = cell.getBoundingClientRect();
          this.dropdownPosition = {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          };
        }
      }
    },
    executeAction() {
      // Perform action based on selected option

      if (this.selectedAction === "attack") {
        // Logic for attack action
        const rowIndex = this.selectedCell.row;
        const cellIndex = this.selectedCell.col;
        const cell = [cellIndex, rowIndex];

        this.attacking.city1 = cell;
        this.attacking.state = true;

        console.log("Attack action performed");
      } else if (this.selectedAction === "relocate") {
        const rowIndex = this.selectedCell.row;
        const cellIndex = this.selectedCell.col;
        const cell = this.board[rowIndex][cellIndex];
        // Remove color and text from old main city
        if (this.currentPlayer === "Player 1") {
          const [oldRow, oldCol] = this.player1Data.mainCity;
          const oldCellElement = document.querySelector(
            `.board-row:nth-child(${oldRow + 1}) .board-cell:nth-child(${
              oldCol + 1
            })`
          );
          if (oldCellElement) {
            oldCellElement.style.backgroundColor = "#ccc"; // Reset to default color
            oldCellElement.innerHTML = "";
            oldCellElement.classList.remove("marked-box");
          }
          // Move main city to the selected cell
          this.player1Data.mainCity = [rowIndex, cellIndex];
        } else {
          const [oldRow, oldCol] = this.player2Data.mainCity;
          const oldCellElement = document.querySelector(
            `.board-row:nth-child(${oldRow + 1}) .board-cell:nth-child(${
              oldCol + 1
            })`
          );
          if (oldCellElement) {
            oldCellElement.style.backgroundColor = "#ccc"; // Reset to default color
            oldCellElement.innerHTML = "";
            oldCellElement.classList.remove("marked-box");
          }
          // Move main city to the selected cell
          this.player2Data.mainCity = [rowIndex, cellIndex];
        }
        // Change cell background color to indicate main city
        const cellElement = document.querySelector(
          `.board-row:nth-child(${rowIndex + 1}) .board-cell:nth-child(${
            cellIndex + 1
          })`
        );
        if (cellElement) {
          cellElement.style.backgroundColor =
            this.currentPlayer === "Player 1" ? "red" : "blue";
          cellElement.innerHTML = "Main";
          cellElement.classList.add("marked-box");
        }
        console.log("Relocate action performed");
      } else if (this.selectedAction === "buy") {
        const rowIndex = this.selectedCell.row;
        const cellIndex = this.selectedCell.col;
        const cell = [cellIndex, rowIndex];
        var numberRegex = /\s(\d+)/;

        console.log(
          this[`player${this.currentPlayer.match(numberRegex)[1]}Data`]
            .mainCity,
          "Unnee"
        );
        console.log(this.currentPlayer);

        const value = prompt(
          "Enter value for the region (e.g., population, resources):"
        );
        axios
          .post(
            `http://localhost:8080/RandomContinent/BuyRegion?player=${this.currentPlayer}&budget=${value}&coordinate=${cell}`
          )
          .then((res) => {
            if (res.status == 200) {
              if (this.currentPlayer === "Player 1") {
                var size = res.data.myCoordinates.length;
                const cellElement = document.querySelector(
                  `.board-row:nth-child(${
                    res.data.myCoordinates[size - 1].coordinates[1] + 1
                  }) .board-cell:nth-child(${
                    res.data.myCoordinates[size - 1].coordinates[0] + 1
                  })`
                );
                if (cellElement) {
                  cellElement.style.backgroundColor = "#ffc0cb"; // Pink pastel
                  cellElement.innerHTML =
                    res.data.myCoordinates[size - 1].power;
                }
              }
              if (this.currentPlayer === "Player 2") {
                var size = res.data.myCoordinates.length;
                const cellElement = document.querySelector(
                  `.board-row:nth-child(${
                    res.data.myCoordinates[size - 1].coordinates[1] + 1
                  }) .board-cell:nth-child(${
                    res.data.myCoordinates[size - 1].coordinates[0] + 1
                  })`
                );
                if (cellElement) {
                  cellElement.style.backgroundColor = "#82aeff"; // Blue pastel
                  cellElement.innerHTML =
                    res.data.myCoordinates[size - 1].power;
                }
              }
              console.log(res);
              this[
                `player${this.currentPlayer.match(numberRegex)[1]}Data`
              ].budget = res.data.money;
            }
          })
          .catch((e) => {
            console.log(e);
            alert(e.response.data);
          });

        console.log("Buy action performed");
      }
      // Hide dropdown after action executed
      this.showDropdown = false;
    },

    changeColorStr(rowIndex, cellIndex) {
      console.log(`Box clicked: (${rowIndex},${cellIndex})`);
      const cell = document.querySelector(
        `.board-row:nth-child(${rowIndex + 1}) .board-cell:nth-child(${
          cellIndex + 1
        })`
      );
      if (cell) {
        if (this.currentPlayer === "Player 1") {
          cell.style.backgroundColor = "red";
        } else {
          cell.style.backgroundColor = "blue";
        }
        cell.innerHTML = "Main";
        cell.classList.add("marked-box");
      }
    },
    endTurnStr() {
      clearInterval(this.timerInterval);
      this.currentPlayer =
        this.currentPlayer === "Player 1" ? "Player 2" : "Player 1";

      this.resetTimer();
    },
    endTurn() {
      clearInterval(this.timerInterval);
      this.currentPlayer =
        this.currentPlayer === "Player 1" ? "Player 2" : "Player 1";
      console.log(this.currentPlayer);
      axios
        .post(
          `http://localhost:8080/RandomContinent/AddInterest?player=${this.currentPlayer}`
        )
        .then((res) => {
          var numberRegex = /\s(\d+)/;
          this[`player${this.currentPlayer.match(numberRegex)[1]}Data`].budget =
            res.data;
        });
      this.resetTimer();
    },
    hoverCell(rowIndex, cellIndex) {
      this.hoveredRowIndex = rowIndex;
      this.hoveredCellIndex = cellIndex;
    },
    unhoverCell() {
      this.hoveredRowIndex = null;
      this.hoveredCellIndex = null;
    },
    isHovered(rowIndex, cellIndex) {
      return (
        rowIndex === this.hoveredRowIndex && cellIndex === this.hoveredCellIndex
      );
    },
    setWinner() {
      if (this.currentPlayer == "Player 1") {
        localStorage.setItem("Winner", this.player1);
      } else {
        localStorage.setItem("Winner", this.player2);
      }
    },
  },
};
</script>

<style scoped>
.container {
  background-image: url("../assets/playBg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.status1-bar {
  margin-top: 10px;
  font-size: 14px;
  background-color: #ffc0cb;
}

.status2-bar {
  margin-top: 10px;
  font-size: 14px;
  background-color: #82aeff;
}

.title-container {
  text-align: center;
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
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.board-row {
  display: flex;
}

.board-cell {
  width: 3.5vw;
  height: calc(3.5vw * 1.18);
  background-color: #ccc;
  position: relative;
  margin: 0.05vw;
  display: flex;
  justify-content: center;
  align-items: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.even-row {
  transform: translateX(50%);
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
  color: white;
}

.marked-box {
  font-weight: bold;
  -webkit-text-stroke-color: white;
  -webkit-text-stroke-width: 0.1px;
}

.dropdown-menu {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 2px;
}

.dropdown-menu select {
  margin-right: 10px;
}
.board-cell:hover {
  transform: scale(1.05); /* Scale the cell to 110% when hovered over */
  transition: transform 0.3s ease; /* Smooth transition effect */
  background-color: #a1a1a1;
}

.custom-cursor {
  cursor: url("../assets/sword.png"), auto;
}
.nm-cursor {
  cursor: url("../assets/wr.png"), auto;
}
</style>
