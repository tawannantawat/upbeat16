<template>
  <div>
    <div>
      <h1>the victory is {{ winner }}</h1>
    </div>
    <h1>ENDED! Thank you for playing!</h1>
    <router-link to="/">Press here to go to menu</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      winner: null,
    };
  },
  mounted() {
    // Access localStorage here
    this.winner = localStorage.getItem("Winner");
  },
};
</script>

<style></style>
