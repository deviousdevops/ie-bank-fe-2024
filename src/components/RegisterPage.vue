<template>
  <div class="register-page">
    <div class="register-container">
      <h2 class="text-center mb-4">Create Your Account</h2>
      <p class="text-center mb-4">Join the best bank in the world</p>
      <b-alert v-if="showAlert" :variant="alertVariant" show class="mb-4">{{ message }}</b-alert>
      <b-form @submit.prevent="handleRegister" class="register-form">
        <b-form-group label="Username" :state="usernameState" invalid-feedback="Username must be at least 6 characters long.">
          <b-form-input v-model="username" required></b-form-input>
        </b-form-group>
        <b-form-group label="Email" :state="emailState" invalid-feedback="Please enter a valid email address.">
          <b-form-input type="email" v-model="email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Password" :state="passwordState" invalid-feedback="Password must contain letters and at least one number.">
          <b-form-input type="password" v-model="password" required></b-form-input>
        </b-form-group>
        <b-form-group label="Confirm Password" :state="confirmPasswordState" invalid-feedback="Passwords do not match!">
          <b-form-input type="password" v-model="confirmPassword" required></b-form-input>
        </b-form-group>
        <b-form-group label="Country">
          <b-form-input v-model="country" required></b-form-input>
        </b-form-group>
        <b-form-group label="Date of Birth" :state="dobState" invalid-feedback="You must be at least 18 years old to register.">
          <b-form-input type="date" v-model="date_of_birth" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="w-100 mt-3" variant="primary">Register</b-button>
        <p class="text-center mt-4">
          Already have an account?
          <router-link to="/login" class="link">Log in here</router-link>
        </p>
      </b-form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { trackEvent } from '../appInsights';

export default {
  data() {
    return {
      id: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      date_of_birth: '',
      role: '',
      status: '',
      message: "",
      alertVariant: "",
      showAlert: false,
      usernameState: null,
      emailState: null,
      passwordState: null,
      confirmPasswordState: null,
      dobState: null,
    };
  },
  methods: {
    handleRegister() {
      let isValid = true;

      // username check errors
      if (this.username.length < 6) {
        this.usernameState = false;
        isValid = false;
      } else {
        this.usernameState = true;
      }

      // email check errors
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.emailState = false;
        isValid = false;
      } else {
        this.emailState = true;
      }

      // password check errors
      const passwordRegex = /^(?=.*[0-9])[a-zA-Z0-9]+$/;
      if (!passwordRegex.test(this.password) || this.password.length < 8) {
        this.passwordState = false;
        isValid = false;
      } else {
        this.passwordState = true;
      }

      // confirm password
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordState = false;
        isValid = false;
      } else {
        this.confirmPasswordState = true;
      }

      // date of birth check errors
      const today = new Date();
      const birthDate = new Date(this.date_of_birth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference =
        today.getMonth() - birthDate.getMonth() +
        (today.getDate() < birthDate.getDate() ? -1 : 0);
      if (isNaN(birthDate) || age < 18 || (age === 18 && monthDifference < 0)) {
        this.dobState = false;
        isValid = false;
      } else {
        this.dobState = true;
      }

      if (!isValid) {
        this.showMessage('Please correct the highlighted fields.', 'danger');
        // Log failed validation event
        trackEvent('RegisterValidationFailed', {
          username: this.username,
          email: this.email,
          country: this.country,
          date_of_birth: this.date_of_birth,
        });
        return;
      }
      // Log successful validation event
      trackEvent('RegisterValidationPassed', {
        username: this.username,
        email: this.email,
        country: this.country,
        date_of_birth: this.date_of_birth,
      });

      // Proceed with registration if all validations pass
      this.showMessage('Validation successful! Registering...', 'success');
      setTimeout(() => this.RESTregister(), 2000);
    },

    // Show alert message
    showMessage(message, variant) {
      this.message = message;
      this.alertVariant = variant;
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    },

    RESTregister() {
      const path = `${process.env.VUE_APP_ROOT_URL}/register`; // Backend API URL

      // Prepare the payload with form data
      const payload = {
        username: this.username,
        email: this.email,
        password: this.password,
        country: this.country,
        date_of_birth: this.date_of_birth,
      };
      console.log(payload)

      // Log registration attempt
      trackEvent('RegisterAttempt', {
        username: this.username,
        email: this.email,
        country: this.country,
      });

      axios
        .post(path, payload) // Send POST request with the payload
        .then((response) => {  
          // Log successful registration event
          trackEvent('RegisterSuccess', {
            username: this.username,
            email: this.email,
            country: this.country,
          });

          this.showMessage('Registration successful! Redirecting...', 'success');
          this.$router.push("/login"); // Redirect to the login page
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
          // Log registration error event
          trackEvent('RegisterError', {
            username: this.username,
            email: this.email,
            country: this.country,
            errorMessage,
          });
          this.showMessage(errorMessage, 'danger');
        });
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #0648d7, #2ea901);
}

.register-container {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.text-center {
  text-align: center;
}

h2.text-center {
  color: white;
  font-size: 40x;
}

p.text-center {
  color: #e0e0e0;
}

.register-form {
  margin-top: 20px;
  color: #ffffff;
}

b-button {
  background-color: #0648d7;
  border-color: #0648d7;
}

.link {
  color: #21d25c;
}
</style>

