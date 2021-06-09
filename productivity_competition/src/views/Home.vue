<template>
  <div class="home">
    <Navbar />
    <div id="searchBar">
      <Search
        v-bind:AccountHabits="AccountHabits"
        v-bind:AllHabits="AllHabits"
      />
    </div>
    <div id="content">
      <v-layout class="fill-height" id="central" justify-center>
        <div id="homeStat">
          <HomeStat
            v-bind:AccountHabits="AccountHabits"
            v-bind:AllHabits="AllHabits"
            v-bind:account="account"
            v-bind:forums="forums"
          />
        </div>
        <RankingList
          v-bind:ThreeRandomHabits="ThreeRandomHabits"
        />
      </v-layout>
    </div>
    <Pb
    v-bind:AccountHabits="AccountHabits"
    />
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
import Navbar from "../components/Home/Navbar.vue";
import Search from "../components/Home/Search.vue";
import HomeStat from "../components/Home/homeStat.vue";
import Pb from "../components/Home/progressbar.vue";
import RankingList from "../components/Home/RankingList.vue";
import axios from 'axios';
import ENV from './config.js'
const API_HOST = ENV.api_host
export default {
  name: "newHome",
  components: {
    Navbar,
    Search,
    HomeStat,
    Pb,
    RankingList,
  },
  data() {
    return {
      AllHabits: [],
      AccountHabits: [],
      forums: [],
      account: null,
      popnotif2: false,
      notiftext2: ""
    };
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

    try{
      const res = await axios.get(`${API_HOST}/habits`);
      res.data.map((habit) => {
        this.AllHabits.push(habit)
			})
    } catch(error) {
      console.log(error)
    }

    try{
      const res = await axios.get(`${API_HOST}/account`);
      this.account = res.data
    } catch(error) {
      console.log(error)
    }

    try{
      const res = await axios.get(`${API_HOST}/accountHabits`);
      res.data.habits.map((habit) => {
        habit.dialog = false
        this.AccountHabits.push(habit)
      })
    } catch(error) {
      console.log(error)
    }

    try{
      this.makeforums()
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    availableHabits() {
      return this.AllHabits.map(habit => habit.name)
    },
    ThreeRandomHabits() {
      const random = []
      const habits = []
      if (this.AllHabits.length <= 3){
        return this.AllHabits
      }
      while (random.length < 3) {
        const n = Math.floor(Math.random() * (this.AllHabits.length))
        if (!random.includes(n)){
          random.push(n)
          habits.push(this.AllHabits[n])
        }
      }
      return habits
    }
  },
  methods: {
    async refreshAccountHabit() {
      while (this.availableHabits.length > 0) {
        this.AccountHabits.pop()
      }
      try{
        const res = await axios.get(`${API_HOST}/accountHabits`);
        res.data.habits.map((habit) => {
        habit.dialog = false
        this.AccountHabits.push(habit)
      })
      } catch(error) {
        console.log(error)
      }
    },
    find_habit(AccountHabit) {
      return this.AllHabits.find(habit => habit.habit_id === AccountHabit.habit_id)
    },
    makeforums() {
      this.AccountHabits.map((habit) => {
        const forum = {
          name: this.find_habit(habit).name,
          url: '/Forum/?id=' + habit.habit_id
        }
        this.forums.push(forum)
      })
      return this.forums
    },
    checkTokenValidity(token) {
      if (token) {
        const decodedToken = jwt(token)
        return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
      }
      return false
    },
  }
};

</script>

<style scoped>
#searchBar {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
}

#rankingList {
  height: 70vh;
  width: 250px;
}

#homeStat {
  height: 70vh;
  width: 60%;
}
#content {
  height: 70vh;
}
</style>
