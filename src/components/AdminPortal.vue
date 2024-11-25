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
        <tr v-for="user in useraccounts" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.hashed_password }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.date_of_birth }}</td>
          <td>{{ user.status }}</td>
          <td>{{ user.role }}</td>
          <td>
            <!-- Edit Button -->
            <button class="btn btn-primary btn-sm" @click="openUpdateModal(user)">Edit</button>
            <!-- Delete Button -->
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Shared Modal -->
    <b-modal ref="userModal" :title="isEditing ? 'Edit User' : 'Create New User'" hide-footer>
      <b-form @submit.prevent="isEditing ? onSubmitUpdate() : onSubmitCreate()" class="modal-form">
        <b-form-group label="Username" label-for="username-input">
          <b-form-input id="username-input" v-model="editUserAccountForm.username" required></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password-input">
          <b-form-input id="password-input" type="password" v-model="editUserAccountForm.hashed_password" required></b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="email-input">
          <b-form-input id="email-input" type="email" v-model="editUserAccountForm.email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Date of Birth" label-for="dob-input">
          <b-form-input id="dob-input" type="date" v-model="editUserAccountForm.date_of_birth" required></b-form-input>
        </b-form-group>
        <b-form-group label="Status" label-for="status-input">
          <b-form-input id="status-input" v-model="editUserAccountForm.status" required></b-form-input>
        </b-form-group>
        <b-form-group label="Role" label-for="role-input">
          <b-form-input id="role-input" v-model="editUserAccountForm.role" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="success">
          {{ isEditing ? 'Update User' : 'Create User' }}
        </b-button>
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
      isEditing: false,
      editUserAccountForm: {
        id: "",
        username: "",
        password: "", // Change from hashed_password to password
        email: "",
        date_of_birth: "",
        country: "", // Add country field
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
      const path = `${process.env.VUE_APP_ROOT_URL}/admin/users`;
      axios
        .post(path, payload, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
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
      axios
        .get(`${process.env.VUE_APP_ROOT_URL}/admin_portal`, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then((response) => {
          this.useraccounts = response.data.users;
        })
        .catch(error => {
          console.error(error);
        });
    },

    // PUT functions
    RESTupdateUserAccount(payload, userId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/admin/users/${userId}`;
      axios
        .put(path, payload, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
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
    RESTdeleteUserAccount(userId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/admin/users/${userId}`;
      axios
        .delete(path, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then(() => {
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
    },

    /***************************************************
    * FORM MANAGEMENT
    **************************************************/
      
    initEditUserForm() {
      this.editUserAccountForm = {
        id: "",
        username: "",
        password: "", // Change from hashed_password to password
        email: "",
        date_of_birth: "",
        country: "", // Add country field
        status: "",
        role: "",
      };
    },

    // Open Create Modal
    openCreateModal() {
      this.isEditing = false; // Set to create mode
      this.initEditUserForm(); // Clear the form
      this.$refs.userModal.show(); // Show the modal
    },

    // Open Update Modal
    openUpdateModal(user) {
      this.isEditing = true; // Set to edit mode
      this.editUserAccountForm = { ...user, password: "" }; // Populate the form with selected user data and clear password
      this.$refs.userModal.show(); // Show the modal
    },

    // Submit Create
    onSubmitCreate() {
      const payload = { ...this.editUserAccountForm }; // Prepare payload
      delete payload.id; // Remove ID for creation
      this.RESTcreateUserAccount(payload); // Call API
      this.$refs.userModal.hide(); // Close modal
    },

    // Submit Update
    onSubmitUpdate() {
      const payload = { ...this.editUserAccountForm }; // Prepare payload
      this.RESTupdateUserAccount(payload, this.editUserAccountForm.id); // Call API
      this.$refs.userModal.hide(); // Close modal
    },

    // Delete a user
    deleteUser(userId) {
      this.RESTdeleteUserAccount(userId); // API call
    },
  },

  created() {
    this.RESTgetusers();
  },
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

.modal-form {
  padding: 20px;
  background-color: #f8f9fa; /* Light gray background */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.modal-form b-form-group {
  margin-bottom: 15px;
}

.modal-form b-form-input,
.modal-form b-form-select {
  border-radius: 5px;
  border: 1px solid #ccc; /* Light border */
  padding: 10px;
}

.modal-form b-form-input:focus,
.modal-form b-form-select:focus {
  border-color: #117b72; /* Matches button hover */
  box-shadow: 0 0 5px rgba(17, 123, 114, 0.5); /* Subtle glow */
}

.modal-submit-button {
  width: 100%; /* Full-width button */
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  background: linear-gradient(to bottom right, #379b92, #117b72); /* Gradient background */
  color: white;
  border: none;
  transition: background-color 0.3s ease; /* Smooth hover effect */
}

.modal-submit-button:hover {
  background: linear-gradient(to bottom right, #2ea901, #0648d7); /* Change gradient on hover */
  color: white;
}

</style>
