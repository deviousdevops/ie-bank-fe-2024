<template>
<div class="register-page">
    <h2>Create Your Account</h2>
    <p>Join the best bank in the world</p>
    <form @submit.prevent="handleRegister" class="register-form">
    <label for="username">Username</label>
    <input type="text" id="username" v-model="username" required />

    <label for="email">Email</label>
    <input type="email" id="email" v-model="email" required />

    <label for="password">Password</label>
    <input type="password" id="password" v-model="password" required />

    <label for="confirmPassword">Confirm Password</label>
    <input type="password" id="confirmPassword" v-model="confirmPassword" required />

    <label for="dob">Date of Birth</label>
    <input type="date" id="dob" v-model="date_of_birth" required />

    <button type="submit" class="submit-button">Register</button>

    <p class="login-link">
        Already have an account?
        <router-link to="/" class="link">Log in here</router-link>
    </p>
    </form>
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      date_of_birth: ''
    };
  },
  methods: {
    handleRegister() {
      const payload = {
        username: this.username,
        email: this.email,
        password: this.password,
        date_of_birth: this.date_of_birth
      };

      // Call the backend API to register the user
      axios
        .post(`${process.env.VUE_APP_ROOT_URL}/register`, payload)
        .then(() => {
          // Show success message (optional)
          alert("Registration successful! Please log in.");

          // Redirect to the login page
          this.$router.push('/');
        })
        .catch((error) => {
          console.error("Registration failed:", error);
        });
    }
  }
};
</script>


<style scoped>
.register-page {
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

.register-form {
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

.login-link {
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

