<template>
  <div class="user-portal">
    <!-- Header Section -->
    <div class="header">
      <h1 class="user-title">User Portal</h1>
      <button class="logout-button" @click="logout">Logout</button>
    </div>

    <!-- Accounts Section -->
    <h1 class="section-title">My Accounts</h1>
    <button class="btn-create" v-b-modal.account-modal>Create Account</button>

    <b-alert v-if="showMessage" :variant="alertVariant" show>
      {{ message }}
    </b-alert>

    <table class="table table-hover account-table">
      <thead>
        <tr>
          <th>Account Name</th>
          <th>Account Number</th>
          <th>Balance</th>
          <th>Currency</th>
          <th>Country</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.id">
          <td>{{ account.name }}</td>
          <td>{{ account.account_number }}</td>
          <td>{{ account.balance }}</td>
          <td>{{ account.currency }}</td>
          <td>{{ account.country }}</td>
          <td>
            <span v-if="account.status === 'Active'" class="badge badge-success">{{ account.status }}</span>
            <span v-else class="badge badge-danger">{{ account.status }}</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-info btn-sm" @click="openUpdateAccountModal(account)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteAccount(account.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Transactions Section -->
    <h1 class="section-title">Recent Transactions</h1>
    <button class="btn-create" v-b-modal.transaction-modal>Create Transaction</button>

    <table class="table table-hover transactions-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>From Account</th>
          <th>To Account</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.created_at }}</td>
          <td>{{ transaction.amount }}</td>
          <td>{{ transaction.currency }}</td>
          <td>{{ transaction.from_account }}</td>
          <td>{{ transaction.to_account }}</td>
          <td>{{ transaction.status }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Create Account Modal -->
    <b-modal ref="accountModal" id="account-modal" title="Create Account" hide-footer>
      <b-form @submit.prevent="onSubmitAccount" class="modal-form">
        <b-form-group label="Account Name">
          <b-form-input v-model="createAccountForm.name" placeholder="Enter account name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Balance">
          <b-form-input type="number" v-model="createAccountForm.balance" placeholder="Enter positive balance" required></b-form-input>
        </b-form-group>
        <b-form-group label="Currency" :state="isCurrencyValid" invalid-feedback="Currency must be a valid symbol (e.g., € or $)">
          <b-form-input v-model="createAccountForm.currency" placeholder="Enter currency (€ or $)" @input="validateCurrency" required></b-form-input>
        </b-form-group>
        <b-form-group label="Country">
          <b-form-input v-model="createAccountForm.country" placeholder="Enter country" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="success">Create Account</b-button>
      </b-form>
    </b-modal>

    <!-- Create Transaction Modal -->
    <b-modal ref="transactionModal" id="transaction-modal" title="Create Transaction" hide-footer>
      <b-form @submit.prevent="onSubmitTransaction" class="modal-form">
        <b-form-group label="Amount">
          <b-form-input type="number" v-model="createTransactionForm.amount" placeholder="Enter transaction amount" required></b-form-input>
        </b-form-group>
        <b-form-group label="Currency" :state="isCurrencyValid" invalid-feedback="Currency must be a valid symbol (e.g., € or $)">
          <b-form-input v-model="createTransactionForm.currency" placeholder="Enter currency (€ or $)" @input="validateCurrency" required></b-form-input>
        </b-form-group>
        <b-form-group label="From Account Number">
          <b-form-select v-model="createTransactionForm.from_account_number" :options="accountOptions" placeholder="Select an account number" required></b-form-select>
        </b-form-group>
        <b-form-group label="To Account Number" :state="isToAccountNumberValid" invalid-feedback="Account number must be numeric">
          <b-form-input v-model="createTransactionForm.to_account_number" placeholder="Enter recipient account number" @input="validateToAccountNumber" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="success">
          Create Transaction
        </b-button>
      </b-form>
    </b-modal>


    <!-- Edit Account Modal -->
    <b-modal ref="editAccountModal" id="edit-account-modal" title="Edit Account" hide-footer>
      <b-form @submit.prevent="onSubmitEditAccount" class="modal-form">
        <b-form-group label="Account Name">
          <b-form-input v-model="editAccountForm.name" placeholder="Enter new account name" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="info">Update Account</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      editAccountForm: {
        name: '',
        id: null,
      },
      accounts: [], // Define accounts
      transactions: [], // Define transactions
      createAccountForm: { // Define createAccountForm
        name: '',
        currency: '',
        balance: '', // Include balance
        country: '',
      },
      createTransactionForm: { // Define createTransactionForm
        from_account_number: '',
        to_account_number: '',
        amount: '',
        currency: '', // Include currency
      },
      alertVariant: '', // Define alertVariant
      message: '', // Define message
      accountOptions: [], // Define accountOptions
      isCurrencyValid: true, 
      isToAccountNumberValid: true,
      token: localStorage.getItem('authToken'), // Ensure you have the JWT token stored
    };
  },
  methods: {
    async RESTupdateAccount(payload, id) {
      try {
        const response = await axios.put(`${process.env.VUE_APP_ROOT_URL}/accounts/${id}`, payload, {
          headers: {
            'x-access-token': this.token, // Use the stored token
          },
        });
        console.log('Account updated:', response.data);
        this.showMessage('Account updated successfully');
        this.RESTgetAccountsandTransactions(); // Refresh accounts and transactions
      } catch (error) {
        console.error('Error updating account:', error);
        this.showMessage('Error updating account');
      }
    },
    async RESTdeleteAccount(id) {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_ROOT_URL}/accounts/${id}`, {
          headers: {
            'x-access-token': this.token, // Use the stored token
          },
        });
        console.log('Account deleted:', response.data);
        this.showMessage('Account deleted successfully');
        this.RESTgetAccountsandTransactions(); // Refresh accounts and transactions
      } catch (error) {
        console.error('Error deleting account:', error);
        this.showMessage('Error deleting account');
      }
    },
    async RESTgetAccountsandTransactions() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_ROOT_URL}/user_portal`, {
          headers: {
            'x-access-token': this.token, // Use the stored token
          },
        });
        console.log('Accounts and transactions:', response.data);
        this.accounts = response.data.accounts; // Set accounts
        this.transactions = response.data.transactions; // Set transactions
        this.accountOptions = this.accounts.map(account => ({
          value: account.account_number, // Use account number as value
          text: account.account_number, // Display account number
        }));
      } catch (error) {
        console.error('Error fetching accounts and transactions:', error);
        this.showMessage('Error fetching accounts and transactions');
      }
    },
    async onSubmitAccount() {
      this.validateCurrency();
      if (!this.isCurrencyValid) {
        this.showMessage('Please enter a valid currency symbol (e.g., € or $)');
        return;
      }
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_URL}/accounts`, this.createAccountForm, {
          headers: {
            'x-access-token': this.token, // Use the stored token
          },
        });
        console.log('Account created:', response.data);
        this.showMessage('Account created successfully');
        this.RESTgetAccountsandTransactions(); // Refresh accounts and transactions
        this.createAccountForm = { name: '', currency: '', balance: '', country: '' }; // Reset form
        this.isCurrencyValid = true;
        this.$refs.accountModal.hide(); // Hide the modal after account creation
      } catch (error) {
        console.error('Error creating account:', error);
        this.showMessage('Error creating account');
      }
    },
    async onSubmitEditAccount() {
      try {
        const response = await axios.put(`${process.env.VUE_APP_ROOT_URL}/accounts/${this.editAccountForm.id}`, this.editAccountForm, {
          headers: {
            'x-access-token': this.token, // Use the stored token
          },
        });
        console.log('Account updated:', response.data);
        this.showMessage('Account updated successfully');
        this.RESTgetAccountsandTransactions(); // Refresh accounts and transactions
        this.initEditForm(); // Reset form
        this.$refs.editAccountModal.hide(); // Hide the modal after account update
      } catch (error) {
        console.error('Error updating account:', error);
        this.showMessage('Error updating account');
      }
    },
    validateCurrency() {
    const validCurrencySymbols = ['€', '$', '£', '¥', '₹']
    this.isCurrencyValid = validCurrencySymbols.includes(this.createTransactionForm.currency.trim());
    },
    validateToAccountNumber() {
      // Check if the input is numeric
      this.isToAccountNumberValid = /^\d+$/.test(this.createTransactionForm.to_account_number.trim());
    },

    async onSubmitTransaction() {
      this.validateCurrency();
      this.validateToAccountNumber();
      if (!this.isCurrencyValid) {
        this.showMessage('Please enter a valid currency symbol (e.g., € or $)');
        return;
      }
      if (!this.isToAccountNumberValid) {
      this.showMessage('To Account Number must be numeric');
      return;
    }

      try {
        const payload = {
          from_account_number: this.createTransactionForm.from_account_number,
          to_account_number: this.createTransactionForm.to_account_number,
          amount: parseFloat(this.createTransactionForm.amount), // Convert amount to float
          currency: this.createTransactionForm.currency,
        };
        const response = await axios.post(`${process.env.VUE_APP_ROOT_URL}/transactions`, payload, {
          headers: {
            'x-access-token': this.token, // Use the stored token
          },
        });
        console.log('Transaction created:', response.data);
        this.showMessage('Transaction created successfully');
        this.RESTgetAccountsandTransactions(); // Refresh accounts and transactions
        this.createTransactionForm = { from_account_number: '', to_account_number: '', amount: '', currency: '' }; 
        this.isCurrencyValid = true;
        this.isToAccountNumberValid = true;
        this.$refs.transactionModal.hide(); // Hide the modal after transaction creation
      } catch (error) {
        console.error('Error creating transaction:', error.response ? error.response.data : error.message);
        this.showMessage('Error creating transaction');
      }
    },
    initEditForm() {
      this.editAccountForm = {
        name: '',
        id: null,
      };
    },
    editAccount(account) {
      this.editAccountForm = { ...account };
    },
    openUpdateAccountModal(account) {
      this.editAccount(account);
      this.$refs.editAccountModal.show();
    },
    deleteAccount(id) {
      this.RESTdeleteAccount(id);
    },
    logout() {
      // Implement logout functionality
      localStorage.removeItem('authToken');
      this.$router.push('/login');
    },
    showMessage(message) {
      // Implement showMessage functionality
      alert(message);
    },
  },
  created() {
    console.log('Created hook called');
    this.RESTgetAccountsandTransactions();
  },
};
</script>


<style scoped>
/* Add your styles here */

.btn-block {
  width: 100%;
  margin-bottom: 15px;
}

.user-portal {
  background: linear-gradient(to bottom right, #8fd3e0, #8ed890);
  padding: 20px;
  color: black; /* Ensure text is black */
}
.header {
  display: flex;
  align-items: center;
  justify-content: center; /* Center the title and button horizontally */
  margin-bottom: 20px;
  position: relative;
}

.user-title {
  font-size: 48px;
  margin: 0 auto;
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

}

.account-table,
.transactions-table {
  border: 2px solid #117b72;
  width: 100%;
  margin-top: 20px;
}

.table th {
  background-color: #f1f1f1;
  color: black;
  text-align: left;
}

.table td {
  border: 1px solid #ddd;
  padding: 10px;
  color: black; /* Ensure text in tables is black */
}

.btn-primary {
  background-color: #0648d7;
  border: none;
}

.btn-primary:hover {
  background-color: #2ea901;
}

.btn-create:hover {
  background: linear-gradient(to bottom right, #379b92, #117b72);
  color: white; /* Ensures the text stays visible */
  border-color: #3cba54; /* Matches the button color */
}

.btn-create {
  background-color: #117b72; /* Original green color */
  color: white;
  border: none; /* Removes any default border */
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  width: 100%; /* Full width for the button */
  margin-bottom: 15px; /* Space below the button */
  border-radius: 5px; /* Rounded corners */
  transition: background-color 0.3s ease; /* Smooth transition for the hover effect */
}

.modal-form {
  padding: 20px;
  background-color: #f8f9fa; /* Light gray background */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  background: linear-gradient(to bottom right, #379b92, #117b72);
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.modal-submit-button:hover {
  background: linear-gradient(to bottom right, #2ea901, #0648d7);
  color: white;
}
</style>
