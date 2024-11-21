<template>
  <div class="admin-portal">
    <div class="header">
      <h1>Admin Portal</h1>
      <!-- Logout Button -->
      <button class="logout-button" @click="logout">Logout</button>
    </div>
    
    <h1>Users</h1>
    <!-- Create New User Button -->
    <button class="create-button" @click="openCreateModal">Create New User</button>

    <!-- Users Table -->
    <table class="table table-hover users-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Password</th>
          <th>Email</th>
          <th>Date of Birth</th>
          <th>Status</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.password }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.date_of_birth }}</td>
          <td>{{ user.status }}</td>
          <td>{{ user.role }}</td>
          <td>
            <!-- Update Button -->
            <button class="btn btn-primary btn-sm" @click="openUpdateModal(user)">Update</button>
            <!-- Delete Button -->
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create/Edit User Modal -->
    <b-modal ref="userModal" :title="isEditing ? 'Edit User' : 'Create New User'" hide-footer>
      <b-form @submit.prevent="isEditing ? updateUser() : createUser()">
        <b-form-group label="Username" label-for="username-input">
          <b-form-input id="username-input" v-model="userForm.username" required></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password-input">
          <b-form-input id="password-input" type="password" v-model="userForm.password" required></b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="email-input">
          <b-form-input id="email-input" type="email" v-model="userForm.email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Date of Birth" label-for="dob-input">
          <b-form-input id="dob-input" type="date" v-model="userForm.date_of_birth" required></b-form-input>
        </b-form-group>
        <b-form-group label="State" label-for="state-input">
          <b-form-input id="state-input" v-model="userForm.state" required></b-form-input>
        </b-form-group>
        <b-form-group label="Role" label-for="role-input">
          <b-form-input id="role-input" v-model="userForm.role" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">{{ isEditing ? 'Update User' : 'Create User' }}</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "AdminPortal",
  data() {
    return {
      useraccounts: [],
      createUserAccountForm: {
        username: "",
        email: "",
        country: "",
        date_of_birth: "",
        role: "",
      },
      editUserAccountForm: {
      id: "",
      username: "",
      password: "",
      email: "",
      date_of_birth: "",
      status: "",
      role: "",
      },
      showMessage: false,
      message: "",
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push("/login");
    },

    // POST function
    RESTcreateUserAccount(payload) {
      const path = `${process.env.VUE_APP_ROOT_URL}/users`;
      axios
        .post(path, payload)
        .then((response) => {
          this.RESTgetusers();
          this.message = "User Account Created Successfully!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch(error => {
          console.error("Error creating user:", error);
          this.RESTgetusers();
        });
    },

    // GET function
    RESTgetusers() {
      axios.post(`${process.env.VUE_APP_ROOT_URL}/users`, this.userForm)
        .then(() => {
          this.useraccounts = response.data.useraccounts;
        })
        .catch(error => {
          console.error(error);
        });
    },

    // PUT functions
    RESTupdateUserAccount(payload, accountId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/useraccounts/${accountId}`;
      axios
        .put(path, payload)
        .then(() => {
          this.RESTgetusers();
          this.message = "User Account Updated Successfully!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          this.RESTgetusers();
        });
    },

    // DELETE function
    RESTdeleteUserAccount(accountId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/useraccounts/${accountId}`;
      axios
        .delete(path)
        .then((response) => {
          this.RESTgetusers();
          this.message = "User Account Deleted Successfully!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error("Error Deleting Account", error);
          this.RESTgetusers();
        });
      }
    },    


  /***************************************************
    * FORM MANAGEMENT
   **************************************************/

    // Initialize forms empty
    initCreateUserAccountForm() {
      this.createUserAccountForm ={
        username: "",
        password:"",
        email: "",
        // currency: "",
        country: "",
        date_of_birth: "",
        role: "",
      };
    },

    initeditUserAccountForm() {
      this.editUserAccountForm = {
        id: "",
        username: "",
        password: "",
        email: "",
        date_of_birth: "",
        status: "",
        role: "",
      };
    },

    onCreateUserAccount(){
      this.$refs.TransactionModal.hide();
      const payload = {
        username: this.createUserAccountForm.username,
        email: this.createUserAccountForm.email,
        password: this.createUserAccountForm.password,
        country: this.createUserAccountForm.country,
        date_of_birth: this.createUserAccountForm.date_of_birth,
        role: this.createUserAccountForm.role,
      };
      this.RESTcreateUserAccount(payload);
      this.initCreateUserAccountForm();
    },
    // Handle edit button
    editAccount(account) {
      this.editUserAccountForm = account;
    },
    
    // Handle Delete button
    deleteAccount(account) {
      this.RESTdeleteUserAccount(account.id);
    },

  created() {
    this.RESTgetusers();
  }
};
</script>

<style scoped>

.header {
  display: flex;
  align-items: center;
  justify-content: center; /* Center the Admin Portal title */
  position: relative; /* Allow the Logout button to be absolutely positioned */
  margin-bottom: 20px;
}

.admin-title {
  font-size: 48px;
  background: -webkit-linear-gradient(right, #0648d7, #2ea901);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin: 0; /* Remove any default margin */
}

.logout-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #d6533c;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.logout-button:hover {
  background-color: #a53b28;
}

.section-title {
  font-size: 36px;
  margin-top: 20px;
  margin-bottom: 10px;
  background: -webkit-linear-gradient(right, #0648d7, #2ea901);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center; /* Center Users title */
}

.admin-portal {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: linear-gradient(to bottom right, #8fd3e0, #8ed890); /* Light background */
  
}

.create-button {
  margin-bottom: 15px;
  background-color: #117b72; 
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.create-button:hover {
  background: linear-gradient(to bottom right, #379b92, #117b72);
  color: white;
}

.users-table {
  border: 2px solid #117b72;
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.users-table th {
  background-color:  #f1f1f1;
  color: rgb(0, 0, 0);
  text-align: left;
  padding: 10px;
}

.users-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.action-button {
  background-color: #0648d7;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

.action-button:hover {
  background-color: #2ea901;
}
</style>
