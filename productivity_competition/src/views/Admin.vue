<template>
  <div class="userProfile">
    <nav>
        <v-toolbar class="primary">
                <v-btn x-large text class="white--text custom-btn" to="/home">
                    <span>Habit </span>
                    <span class="font-weight-light">Challenger </span>
                    <v-icon class="ml-2"> handyman </v-icon>
                    <span class="ml-2">Administration</span>
                </v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed class="ml-5" color="primary--text text--darken-1" to="/">
                <span>Logout</span>
                <v-icon right>login</v-icon>
            </v-btn>
        </v-toolbar>
    </nav>
    <v-row class="pt-6" justify="center">

        <!-- User Listing -->
        <v-col cols="9" class="mx-4 mb-5 pa-1" lg="3" md="3" sm="7" xs="7">
          <v-row class=" grey lighten-3" id="UserListing">
            <v-col>
              <v-row class="white py-3 px-5 mb-5 mx-1 primary--text text--darken-2 text-h5">
                <v-flex>User Listing</v-flex>
              </v-row>
              <v-row class="white py-1 px-3 mb-2 mx-1 primary--text text--darken-2 text-h7" v-for="user in db_accounts" :key="user._id">
                <v-flex xs8>{{user.name}}</v-flex>
                <v-flex xs3 v-if="user.banned">[banned]</v-flex>
                <v-flex xs3 v-if="!user.banned"></v-flex>
                <v-flex xs1>
                    <v-checkbox value="user.name" @click="selectUser(user.account_id)" v-if="currentUserSelection == null || currentUserSelection == user.account_id"></v-checkbox>
                </v-flex>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="grey lighten-3 pa-1" id="UserControls" justify="center"><!-- Action Buttons -->
            <v-col>
              <v-flex xs3>
                <v-btn class="mb-1 yellow" small @click="banUser(currentUserSelection)"> Ban User </v-btn>
              </v-flex>
              <!-- Deprecated
              <v-flex xs3>
                <v-btn class="mb-1 green" small> Reset Password </v-btn>
              </v-flex>-->
              <v-flex xs3>
                <v-btn class="red" small @click="deleteUser(currentUserSelection)"> Delete User </v-btn>
              </v-flex>
            </v-col>
          </v-row>
        </v-col>

        <!-- Habit Listing -->
        <v-col cols="9" class="mx-4 mb-5 pa-1" lg="3" md="3" sm="7" xs="7">
          <v-row class="grey lighten-3" id="HabitListing">
            <v-col>
              <v-row class="white py-3 px-5 mb-5 mx-1 primary--text text--darken-2 text-h5">
                <v-flex>Habit Listing</v-flex>
              </v-row>
              <v-row class="white py-1 px-3 mb-2 mx-1 primary--text text--darken-2 text-h7" v-for="habit in db_habits" :key="habit._id">
                <v-flex xs11>{{ habit.name }}</v-flex>
                <v-flex xs1>
                    <v-checkbox value="habit.name" @click="selectHabit(habit.habit_id)" v-if="currentHabitSelection == null || currentHabitSelection == habit.habit_id">></v-checkbox>
                </v-flex>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="grey lighten-3 pa-1" id="HabitControls" justify="center"><!-- Delete Button-->
            <v-col>
              <v-flex xs3>
                <v-btn class="ml-3 red" @click="deleteHabit(currentHabitSelection)"> Delete Habit </v-btn>
              </v-flex>
            </v-col>
          </v-row>
        </v-col>

        <!-- User Requests Listing -->
        <!-- Deprecated
        <v-col cols="9" class="mx-4 mb-5 pa-1" lg="4" md="4" sm="7" xs="7">
          <v-row class="mb-10 grey lighten-3" id="UserRequest">
            <v-col>
              <v-row class="white pa-3 mb-5 mx-3 primary--text text--darken-2 text-h5">
                <v-flex>User Requests</v-flex>
              </v-row>
              <v-row class="white pa-3 mb-2 mx-3 primary--text text--darken-2 text-h7" v-for="request in requests" :key="request.user">
                <v-flex xs7><h4>{{ request.user }}</h4></v-flex>
                <v-flex xs5 class="text-center">
                    <v-btn color="primary--text" x-small @click="approveAction(request, requests)">Approve</v-btn>
                </v-flex>
                <v-flex xs10>    - {{ request.content }} {{ request.additional}} Request</v-flex>
              </v-row>
            </v-col>
          </v-row>
        </v-col>-->

    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import ENV from './config.js'
const API_HOST = ENV.api_host
export default {
  name: 'Admin',
  mounted: function () {
    axios.get(`${API_HOST}/allAccount`).then((res) => {
        res.data.map((account)=> {
          if(!(account.name == "Admin")){
            this.db_accounts.push(account)
          }
        })

      });

    axios.get(`${API_HOST}/habits`).then((res) => {
        this.db_habits = res.data

      });
  },
  data () {
    return {
      db_accounts: [],
      db_habits: null,
      currentUserSelection: null,
      currentHabitSelection: null
    }
  },
  methods: {
    selectUser: function(id){
      if(id == this.currentUserSelection){
        this.currentUserSelection = null;
      }else{
        this.currentUserSelection = id;
      }
    },

    deleteUser: function(id){
      axios.delete(`${API_HOST}/account/` + id).then((res) => {
        console.warn(res.data)
        axios.get(`${API_HOST}/allAccount`).then((res) => {
        this.db_accounts = res.data

        });
      });

      this.currentUserSelection = null
    },

    selectHabit: function(id){
      if(id == this.currentHabitSelection){
        this.currentHabitSelection = null;
      }else{
        this.currentHabitSelection = id;
      }
    },

    deleteHabit: function(id){
      axios.delete(`${API_HOST}/habit/` + id).then((res) => {
        console.warn(res.data)
        axios.get(`${API_HOST}/habits`).then((res) => {
        this.db_habits = res.data

        });
      });

      this.currentHabitSelection = null
    },

    banUser: function(id){
      axios.get(`${API_HOST}/accountBanned/` + id).then((res) => {
        let data = res.data
        console.warn(res.data)
        if(data.banned){
          axios.patch(`${API_HOST}/accountAdmin/` + id, [{"op":"replace", "path":"/banned", "value":"false"}]).then((res) => {
            console.log(res.data)
            axios.get(`${API_HOST}/allAccount`).then((res) => {
            this.db_accounts = res.data

            });
          });
        }else{
          axios.patch(`${API_HOST}/accountAdmin/` + id, [{"op":"replace", "path":"/banned", "value":"true"}]).then((res) => {
            console.log(res.data)
            axios.get(`${API_HOST}/allAccount`).then((res) => {
            this.db_accounts = res.data

            });
          });
        }
      });
    }
  }
}
</script>


<style scoped>
  #UserListing{
    height: 720px;
  }
  #UserControls{
    height: 120px;
  }
  #HabitListing{
    height: 750px;
  }
  #HabitControls{
    height: 90px;
  }
  #UserRequest{
    height: 840px;
  }
</style>
