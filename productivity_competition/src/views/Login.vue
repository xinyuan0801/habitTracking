<template>
  <div id="page" >
    <v-row id="header-row" class="pb-5 mt-16">
      <h1 class="display-4 blue--text"> Habit Challenger</h1>
    </v-row>

    <div id="userLogin">
      <v-text-field label="Username" dense v-model="username"></v-text-field>
      <v-text-field :type="'password'" label="Password" dense v-model="password"></v-text-field>
    </div>

    <v-row justify="center" class="mt-2 mb-2">
      <v-btn
        depressed
        class="blue white--text"
        id="LoginButton"
        v-on:click="checkLogin"
      >
        Login
      </v-btn>
    </v-row>

    <transition name="fade">
      <v-row v-if="!exist" justify="center">
        <div  class="pb-6 blue--text">Account Does Not Exist! Please Try Again</div>
      </v-row>
    </transition>

    <v-row justify="center" class="pb-7 pt-3">
      <div id="extraButton">
        <v-btn
          class="blue white--text"
          id="newAccountButton"
          v-on:click="cShow()"
        >
          Create New Account
        </v-btn>
      </div>
    </v-row>

    <transition name="fade">
      <v-card v-if="created" class="pa-12" outlined>
        <v-card-title class="justify-center">Creating New Account</v-card-title>

        <v-card-actions class="justify-center">
          <form>
            <input class="mr-5" type="text" v-model="newusername" placeholder="Enter New Username">
            <input class="ml-5" type="text" v-model="newpassword" placeholder="Enter New Password">
          </form>
            <v-btn depressed class="blue white--text" id="createAccountButton" v-on:click="createAccount"> Create Account </v-btn>
        </v-card-actions>
      </v-card>
    </transition>

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

    <v-snackbar v-model="popnotif2">
      {{ notiftext2 }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="popnotif2 = false"
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
import axios from 'axios'
import ENV from './config.js'
const API_HOST = ENV.api_host
export default {
  name: 'Login',
  data () {
    return {
      username:'',
      password:'',
      newusername:'',
      newpassword:'',
      created: false,
      exist: true,
      popnotif: false,
      notiftext: "",
      timeout: 1000,
      popnotif2: false,
      notiftext2: ""
    }
  },
  mounted: async function (){
    const token = localStorage.getItem('token')
    if(token){
      if(this.checkTokenValidity(token)){
        this.$router.push({name: 'Home'})
      }
      else{
        await localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        this.notiftext2 = "Sorry your session has timed out. Please Log in Again"
        this.popnotif2 = true;
      }
    }
  },
  methods: {
    async checkLogin() {
      try{
        const res = await axios.post(`${API_HOST}/admins/login`, { username: this.username, password: this.password });
        const check = res.data.admin
        const token = res.data.token
        if(check){
          console.log("logging admin in")
          // Storing token in localstorage
          localStorage.setItem('token', token)
          //Set of axios defaults
          axios.defaults.headers.common['Authorization'] = token
          this.$router.push({name: 'Admin'})
        }
        else{
          try{
            const res = await axios.post(`${API_HOST}/users/login`, { username: this.username, password: this.password });
            console.log("Logging in")
            const token = res.data.token
            // Storing token in localstorage
            localStorage.setItem('token', token)
            //Set of axios defaults
            axios.defaults.headers.common['Authorization'] = token
            this.$router.push({name: 'Home'})
          } catch (error){
            this.exist = false
            setTimeout(() => { this.exist = true }, 3000)
            console.log("Account doesnt exist")
          }
        }
      } catch(error) {
          console.log("Account doesnt exist")
      }
    },

    cShow() {
      this.created = !this.created
    },

    async createAccount(){
      try {
        const newaccount = { username:this.newusername, password:this.newpassword}
        const res = await axios.post(`${API_HOST}/users`, newaccount);
        if(!res.data.created){
          this.notiftext = res.data;
          this.popnotif = true;
        }
        else{
          console.log("Creating New Account")
        }
      } catch (error){
        console.log("Account Creation Failed");
        this.created = false;
      }
    },
    checkTokenValidity(token) {
      if (token) {
        const decodedToken = jwt(token)
        return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
      }
      return false
    },
  },
}
</script>

<style scoped>
  #header-row {
    justify-content: center;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to  {
    opacity: 0;
  }

  #page {
    margin-top: 170px;
  }
  #userLogin {
    width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  #extraButton {
  }
</style>
