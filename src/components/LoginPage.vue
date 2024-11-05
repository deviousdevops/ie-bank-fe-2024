<template>
  <div class="login-page">
    <h2>Welcome Back to IE Bank</h2>
    <p>Please log in to continue</p>
    <form @submit.prevent="handleLogin" class="login-form">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="username" required />

      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit" class="submit-button">Login</button>

      <p class="register-link">
        Don't have an account? 
        <router-link to="/register" class="link">Register here</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    RESTlogin() {
      const path = `${process.env.VUE_APP_ROOT_URL}/login`;
      axios
        .post(path, {
          username: this.username,
          password: this.password
        })
        .then((response) => {
          this.$store.commit('setToken', response.data.token); // Storing the token in Vuex or localStorage
          this.$router.push('/home'); // Redirect user after login
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    }
}
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom right, #0648d7, #2ea901);
  color: #fff;
}

h2 {
  font-size: 48px;
  background: -webkit-linear-gradient(right, #1b5305, #051d52);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent; /* Fallback for non-webkit browsers */
}

p {
  color: #e0e0e0;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
}

label {
  align-self: flex-start;
  margin-bottom: 5px;
  color: #f0f0f0;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #2ea901;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0648d7;
}

.register-link {
  margin-top: 20px;
  color: #f0f0f0;
}

.link {
  color: #2ea901;
  text-decoration: underline;
  font-weight: bold;
}

.link:hover {
  color: #0648d7;
}
</style>
