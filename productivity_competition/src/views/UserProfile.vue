<template>
  <div class="userProfile">
    <Navbar />
    <v-tabs vertical>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Profile
      </v-tab>
      <!-- Deprecated
      <v-tab>
        <v-icon left>
          mdi-contacts
        </v-icon>
        Friends
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-lock
        </v-icon>
        Setting
      </v-tab>-->
      <v-tab>
        <v-icon left>
          mdi-add
        </v-icon>
        Submit New Habit
      </v-tab>

      <v-tab-item>
        <v-card flat class="profileCard">
          <v-col cols="9" class="mx-3 pa-1">
            <!-- User Info -->
            <!-- Deprecated
            <v-avatar color="black" size="200" class="my-3" justify="center">
              <img src="../assets/logo.png" />
            </v-avatar>-->

            <v-row class="mb-5 grey lighten-3" id="Username">
              <v-col>
                <v-row
                  class="white pa-2 mx-1 primary--text text--darken-2 text-h7"
                  lg="2"
                  md="4"
                  sm="5"
                  xs="5"
                >
                  <v-flex xs9>Name: {{ myName }}</v-flex>
                  <v-flex xs9 v-if="editing">
                    <v-text-field
                      label="Name" v-model="newName"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs3 class="text-center">
                    <v-btn color="primary--text" x-small @click="startEdit" v-if="!editing"
                      >edit</v-btn
                    >
                    <v-btn color="primary--text" x-small @click="finishEdit" v-if="editing"
                      >done</v-btn
                    >
                  </v-flex>
                </v-row>
              </v-col>
            </v-row>

          <!-- The user's current habits -->
          </v-col>
          <v-col cols="9" class="mx-3 pa-1">
            <v-row class="mb-10 grey lighten-3" id="GeneralTable">
              <v-col>
                <v-row
                  class="white pa-2 mb-5 mx-1 primary--text text--darken-2 text-h5"
                >
                  <v-flex>Current Habits</v-flex>
                </v-row>
                <v-row
                  class="white pa-2 mb-2 mx-1 primary--text text--darken-2 text-h7"
                  v-for="habit in db_account_habits.habits"
                  :key="habit._id"
                >
                  <v-flex xs9
                    ><h4>{{ find_habit_name(habit) }}</h4></v-flex
                  >
                  <!-- Deprecated
                  <v-flex xs3 class="text-center">
                    <v-btn color="primary--text" x-small to="/Forum"
                      >goto</v-btn
                    >
                  </v-flex>-->
                  <v-flex xs12> - Challenge: [ {{ find_habit_caption(habit) }} ]</v-flex>
                  <v-flex xs12>
                    - Competing: {{ habit.competing }}</v-flex
                  >
                  <v-flex xs12> - Consecutive Days: {{ habit.days }}</v-flex>
                  <v-flex xs12> - Completed Today: {{ habit.recorded_today }}</v-flex>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-tab-item>

<!-- Deprecated
      <v-tab-item>
        <v-card flat class="profileCard">
          <v-row class="grey lighten-3" id="FriendList"
            >
            <v-col>
              <v-row
                class="white pa-2 mb-5 mx-1 primary--text text--darken-2 text-h5"
              >
                <v-flex>Habit Comrades</v-flex>
              </v-row>
              <v-row
                class="white pa-2 mb-2 mx-1 primary--text text--darken-2 text-h8"
                v-for="friend in friends"
                :key="friend.name"
              >
                <v-flex xs9>{{ friend.name }}</v-flex>
                <v-flex xs2 class="text-center">
                  <v-btn color="primary--text" x-small @click="loadProfile"
                    >go</v-btn
                  >
                </v-flex>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>-->
<!-- Deprecated
      <v-tab-item>
        <v-card flat class="profileCard">
          <v-row class="mb-5 grey lighten-3" id="RequestBox">
            <v-col>
              <v-row
                class="white pa-2 mb-5 mx-1 primary--text text--darken-2 text-h7"
              >
                <v-flex>Account Deletion Request</v-flex>
              </v-row>
              <v-row justify="center">
                <v-btn class="mx-1 my-1 red" small> DELETE ACCOUNT </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>-->

      <!-- Habit Submit Form -->
      <v-tab-item>
        <v-card flat class="profileCard">
          <v-col cols="9">
            <v-row class="white pa-2 mb-5 mx-1 primary--text text--darken-2 text-h5">
                <v-flex xs10 v-if="!banned">Submit New Habit</v-flex>
                <v-flex xs10 v-if="banned">Your Account is currently [BANNED]</v-flex>
                <v-flex xs10 v-if="banned">You cannot submit new habits.</v-flex>
            </v-row>
            <v-row class="white pa-2 mb-5 mx-1 primary--text text--darken-2 text-h6" v-if="!banned">
              <v-flex xs10>
                <v-text-field label="Habit Name" v-model="habitForm_name"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-text-field label="Habit Caption" v-model="habitForm_caption"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-text-field label="Forum Description" v-model="habitForm_ForumDesc"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-btn class="mx-1 my-1" small @click="submitHabit"> Submit </v-btn>
              </v-flex>
            </v-row>
          </v-col>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <v-snackbar
      v-model="submit_notif"
    >
      {{ submit_notif_text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="green"
          text
          v-bind="attrs"
          @click="submit_notif = false"
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
import Navbar from "../components/Home/Navbar";
import axios from 'axios'
import ENV from './config.js'
const API_HOST = ENV.api_host
export default {
  name: "UserProfile",
  components: {
    Navbar,
  },
  mounted: async function () {
    const token = localStorage.getItem('token')
    if(token){
      if(!this.checkTokenValidity(token)){
        this.notiftext2 = "Sorry your session has timed out. Please Log in Again"
        this.popnotif2 = true;
        await localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        setTimeout(() => this.$router.push({name: 'Login'}), 5000);
      }
    }

    if(!localStorage.getItem('token')){
      this.$router.push({name: 'Login'})
    }

    try{
    axios.get(`${API_HOST}/account`).then((res) => {
        this.db_account = res.data
        this.myName = res.data.name
        this.banned = res.data.banned
        console.warn(res.data)
      })
    } catch(error) {
      console.log(error)
    }

    try{
    axios.get(`${API_HOST}/accountHabits`).then((res) => {
        this.db_account_habits = res.data
        console.warn(res.data)
      })
    } catch(error) {
      console.log(error)
    }

    try {
    axios.get(`${API_HOST}/habits`).then((res) => {
        this.db_habits = res.data
        console.warn(res.data)
      })
    } catch(error) {
      console.log(error)
    }
  },
  data() {
    return {
      myName: null,
      newName: "Your Name",
      habitForm_name: null,
      habitForm_caption: null,
      habitForm_ForumDesc: null,
      editing: false,
      banned: false,
      db_account: [],
      db_account_habits: [],
      db_habits: [],
      submit_notif: false,
      submit_notif_text: "Habit is submitted. You can now search it in Home.",
      popnotif2: false,
      notiftext2: ""
    };
  },

  methods: {
    startEdit: function(){
      this.editing = true
    },

    finishEdit: function(){
      axios.patch(`${API_HOST}/accountUP`, [{"op":"replace", "path":"/name", "value":this.newName}])

      this.myName = this.newName
      this.editing = false
    },

    submitHabit: function(){
      axios.post(`${API_HOST}/habit`, {
        name: this.habitForm_name,
        caption: this.habitForm_caption,
        longDescription: this.habitForm_ForumDesc
      })

      this.submit_notif = true
      this.habitForm_name = ""
      this.habitForm_caption = ""
      this.habitForm_ForumDesc = ""
    },

    find_habit_name(AccountHabit) {
      return this.db_habits.find(habit => habit.habit_id === AccountHabit.habit_id).name
    },
    find_habit_caption(AccountHabit) {
      return this.db_habits.find(habit => habit.habit_id === AccountHabit.habit_id).caption
    },
    checkTokenValidity(token) {
      if (token) {
        const decodedToken = jwt(token)
        return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
      }
      return false
    },
  },
};
</script>

<style scoped>
#Username {
  height: 140;
}
#FriendList {
  height: 450;
}
#RequestBox {
  height: 240;
}
#GeneralTable {
  height: 840px;
}
</style>
