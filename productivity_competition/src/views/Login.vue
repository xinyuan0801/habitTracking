<template>
  <div id="container">
    <div id="logoSpace">
      <h1 class="display-4 blue--text">Habit Challenger</h1>
    </div>

    <div id="userLogin">
      <v-text-field label="Username" dense v-model="username"></v-text-field>
      <v-text-field
        :type="'password'"
        label="Password"
        dense
        v-model="password"
      ></v-text-field>
    </div>

    <div id="mainButtons">
      <v-btn
        depressed
        class="blue white--text"
        id="loginButton"
        v-on:click="checkLogin"
      >
        Login
      </v-btn>
    </div>

    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="green lighten-2"
            dark
            v-bind="attrs"
            v-on="on"
            id="newAccountButton"
          >
            Sign Up
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h6 green lighten-2">
            First step to a better yourself!
          </v-card-title>
          <div id="newAccountSet">
            <v-text-field
              label="Set Username"
              dense
              v-model="newusername"
            ></v-text-field>
            <v-text-field
              :type="'password'"
              label="Set Password"
              dense
              v-model="newpassword"
            ></v-text-field>
          </div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="createAccount">
              Create Account
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-snackbar v-model="popnotif">
      {{ notiftext }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="popnotif = false"
          :timeout="timeout"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import jwt from "jwt-decode";
import axios from "axios";
import ENV from "./config.js";
const API_HOST = ENV.api_host;
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      newusername: "",
      newpassword: "",
      popnotif: false,
      notiftext: "",
      timeout: 1000,
      dialog: false,
    };
  },
  mounted: async function() {
    const token = localStorage.getItem("token");
    if (token) {
      if (this.checkTokenValidity(token)) {
        this.$router.push({ name: "Home" });
      } else {
        await localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        this.notiftext =
          "Sorry your session has timed out. Please Log in Again";
        this.popnotif = true;
      }
    }
  },
  methods: {
    async checkLogin() {
      try {
        const res = await axios.post(`${API_HOST}/admins/login`, {
          username: this.username,
          password: this.password,
        });
        const check = res.data.admin;
        const token = res.data.token;
        if (check) {
          console.log("logging admin in");
          // Storing token in localstorage
          localStorage.setItem("token", token);
          //Set of axios defaults
          axios.defaults.headers.common["Authorization"] = token;
          this.$router.push({ name: "Admin" });
        } else {
          try {
            const res = await axios.post(`${API_HOST}/users/login`, {
              username: this.username,
              password: this.password,
            });
            console.log("Logging in");
            const token = res.data.token;
            // Storing token in localstorage
            localStorage.setItem("token", token);
            //Set of axios defaults
            axios.defaults.headers.common["Authorization"] = token;
            this.$router.push({ name: "Home" });
          } catch (error) {
            this.exist = false;
            setTimeout(() => {
              this.exist = true;
            }, 3000);
            this.notiftext =
          "Account does not exist";
        this.popnotif = true;
          }
        }
      } catch (error) {
        this.notiftext =
          "Account does not exist";
        this.popnotif = true;
      }
    },
    async createAccount() {
      try {
        const newaccount = {
          username: this.newusername,
          password: this.newpassword,
        };
        const res = await axios.post(`${API_HOST}/users`, newaccount);
        if (!res.data.created) {
          this.notiftext = "Account create successfully";
          this.popnotif = true;
        } else {
          console.log("Creating New Account");
        }
        this.dialog = false;
      } catch (error) {
        console.log("Account Creation Failed");
        this.created = false;
        this.dialog = false;
      }
    },
    checkTokenValidity(token) {
      if (token) {
        const decodedToken = jwt(token);
        return decodedToken && decodedToken.exp * 1000 > new Date().getTime();
      }
      return false;
    },
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#mainButtons {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#loginButton {
  width: 70px;
}

#userLogin {
  width: 250px;
  margin-top: 70px;
}

#newAccountSet {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
}

#newAccountButton {
  width: 100px;
  margin-top: 10px;
}

#logoSpace {
  text-align: center;
  margin-top: 17vh;
}
</style>
