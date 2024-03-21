<template>
  <div>
    <div class="image-container">
      <!-- Your content goes here -->
      <form class="player-form player1-form" @submit.prevent="setPlayerNames">
        <input
          type="text"
          v-model="player1Name"
          placeholder="Player 1 Name"
          class="player-input"
        />
      </form>
      <form class="player-form player2-form" @submit.prevent="setPlayerNames">
        <input
          type="text"
          v-model="player2Name"
          placeholder="Player 2 Name"
          class="player-input"
        />
      </form>
      <img
        src="../assets/startButton.png"
        alt="Button Image"
        class="button-image"
        @click="navigateToNewPage"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player1Name: "",
      player2Name: "",
    };
  },
  methods: {
    navigateToNewPage() {
      // Use Vue Router's programmatic navigation to navigate to another page
      this.$router.push({
        path: "/play",
        query: { player1: this.player1Name, player2: this.player2Name },
      }); // Change '/new-page' to the path of your desired page
    },
    setPlayerNames() {
      // You can perform any validation or additional logic here before navigating
      // For simplicity, let's assume both names are valid and set them in a Vuex store or local storage
      // Then proceed to navigate
      localStorage.setItem("player1Name", this.player1Name);
      localStorage.setItem("player2Name", this.player2Name);
      this.navigateToNewPage();
    },
  },
};
</script>

<style scoped>
.image-container {
  width: 100vw; /* Set the width to cover the entire viewport */
  height: 100vh; /* Set the height to cover the entire viewport */
  background-image: url("../assets/firstPage.jpg"); /* Use the imported image */
  background-size: cover; /* Cover the entire container */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat; /* Prevent image from repeating */
  position: relative; /* Make the image-container position relative to place forms and button */
}

.player-form {
  position: absolute;
  top: 70%;
  transform: translateY(-50%);
}

.player1-form {
  left: 18%;
}

.player2-form {
  right: 18%;
}

.player-input {
  width: 200px; /* Adjust the width of the input field */
  height: 30px; /* Adjust the height of the input field */
  font-size: 18px; /* Adjust the font size of the input field */
  padding: 10px; /* Adjust the padding of the input field */
}

.button-image {
  width: 250px;
  margin: 0;
  position: absolute;
  top: 68%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
</style>
