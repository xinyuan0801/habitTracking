<template>
  <div>

    <v-card elevation="10" class="mb-12">
        <v-text-field
          color="accent"
          v-model.trim="search"
          append-icon="mdi-magnify"
          @click:append="habitSearch"
          solo
          @keyup.enter="habitSearch"
        ></v-text-field>

        <transition v-for="(habit, i) in searchedHabits" :key="i" name="fade">
          <v-card class="text-center" v-if="searchView">
            <span class="pr-6 pl-6 primary--text text--white">{{ habit }}</span>
            <v-btn
              x-small
              depressed
              class="blue white--text"
              id="LoginButton"
              v-on:click="startTracking(habit)"
            >
              Start Tracking</v-btn
            >
          </v-card>
        </transition>

        <transition name="fade">
          <v-card class="text-center" v-if="blank" outlined>
            <span class="pr-6 pl-6 primary--text text--darken-1"
              >No Matching Habits Found</span
            >
          </v-card>
        </transition>
    </v-card>

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
import axios from 'axios'
import ENV from '../../views/config.js'
const API_HOST = ENV.api_host
export default {
  name: "Search",
  props: ["AccountHabits", "AllHabits", "competitions"],
  data() {
    return {
      suggest: false,
      suggestion: "",
      search: "",
      blank: false,
      popnotif: false,
      timeout: 1000,
      notiftext: "",
      searchView: false,
      searchedHabits: [],
    };
  },
  methods: {
    // sendSuggestion() {
    //   console.log("Sending Suggestion");
    //   this.suggest = false;
    // },
    find_habit_name(AccountHabit) {
      return this.AllHabits.find(habit => habit.habit_id === AccountHabit.habit_id).name
    },
    habitSearch() {
      console.log("Searching For Habit");
      if (this.search == "") {
        this.searchView = false;
        this.blank = true;
        setTimeout(() => {
          this.blank = false;
        }, 3000);
      } else {
        for (let i = 0; i < this.AllHabits.length; i++) {
          if (this.AllHabits[i].name.toLowerCase().includes(this.search.toLowerCase())){
            console.log("Found habit");
            this.blank = false;
            this.searchedHabits.shift();
            this.searchedHabits.push(this.AllHabits[i].name);
            this.searchView = true;
            return;
          }
        }
        this.searchView = false;
        this.blank = true;
      }
    },
    async startTracking(habit) {
      const habits_lower = this.AccountHabits.map((x) => {
        return this.find_habit_name(x).toLowerCase()
      });
      const checkinHabits = habits_lower.includes(habit.toLowerCase());
      if (!checkinHabits) {
        let h_id = -1;
        //console.log(habit)
        this.AllHabits.map((h) =>{
          if(h.name === habit){
            h_id = h.habit_id
          }
        })
        try {
          await axios.patch(`${API_HOST}/accountHabits` , {habit_id: h_id})
          console.log("Adding Habit")
          this.refreshAccountHabit()
        } catch (error){
          console.log(error);
        }
      } else {
          this.notiftext = "you are already tracking this habit";
          this.popnotif = true;
        }
    },
    async refreshAccountHabit() {
      while (this.AccountHabits.length > 0){
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
    // startCompetition(competition) {
    //   this.startTracking(competition);
    //   const competitions_title = this.competitions.map((x) => x.title);
    //   const checkinCompetiton = competitions_title.includes(competition);
    //   if (!checkinCompetiton) {
    //     let newP = new Object();
    //     newP.title = competition;
    //     newP.placement = "7th"; //made up one, will get the accurate result when get data from serve
    //     newP.leaderboard = false;
    //     newP.competitors = [
    //       { name: "Someone", placement: 1, record: 96 },
    //       { name: "Maybe", placement: 2, record: 92 },
    //       { name: "Name", placement: 3, record: 87 },
    //     ];
    //     this.competitions.push(newP);
    //   } else {
    //     this.notiftext = "you are already in the competition";
    //     this.popnotif = true;
    //   }
    // },
  },
};
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
