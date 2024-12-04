<template>
  <div class="homepage">    
    <h1>Welcome to the IE Bank!</h1>
    <p>The best bank in the world</p>
    <div class="links">
      <button @click="goToLogin" class="link-button">Log In</button>
      <button @click="goToRegister" class="link-button">Register</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  methods: {
    goToLogin() {
      this.$router.push("/login"); // Redirect to login page
    },
    goToRegister() {
      this.$router.push("/register"); // Redirect to register page
    },
  },
};
</script>

<style scoped>
.homepage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;

}
h1 {
  font-size: 72px;
  background: -webkit-linear-gradient(right, #0648d7, #2ea901);
  -webkit-background-clip: text;
  background-clip: text;
  align-items: center;
  -webkit-text-fill-color: transparent;
  text-align: center;
  color: transparent;
}
p {
  color: #0e0630;
}
.links {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 0 20px;
}

.link-button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #0648d7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
}
.link-button:hover {
  background-color: #2ea901;
}
</style>
