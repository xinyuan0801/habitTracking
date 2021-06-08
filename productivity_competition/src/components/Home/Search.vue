<template>
  <div>
    <v-card elevation="10" class="mb-3">
      <v-text-field
        hide-details
        color="accent"
        v-model.trim="search"
        append-icon="mdi-magnify"
        @click:append="habitSearch"
        solo
        @keyup.enter="habitSearch"
        placeholder="Search for Habits"
        id="habitSearchBar"
      ></v-text-field>

      <transition v-for="(habit, i) in searchedHabits" :key="i" name="fade">
        <v-card class="text-center" v-if="searchView" id="habits">
          <span class="pr-6 pl-6 primary--text onehabit">{{ habit }}</span>
          <v-btn
            small
            depressed
            class="blue white--text trackingbutton"
            v-on:click="startTracking(habit)"
          >
            Start Tracking</v-btn
          >
          <v-btn
            small
            depressed
            class="blue white--text closebutton"
            v-on:click="searchView = false"
          >
            Close</v-btn
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
import axios from "axios";
import ENV from "../../views/config.js";
const API_HOST = ENV.api_host;
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
    find_habit_name(AccountHabit) {
      return this.AllHabits.find(
        (habit) => habit.habit_id === AccountHabit.habit_id
      ).name;
    },
    habitSearch() {
      if (this.search == "") {
        this.notiftext = "It is important to decide your habits";
        this.popnotif = true;
        this.searchView = false;
      } else {
        for (let i = 0; i < this.AllHabits.length; i++) {
          if (
            this.AllHabits[i].name
              .toLowerCase()
              .includes(this.search.toLowerCase())
          ) {
            console.log("Found habit");
            this.blank = false;
            this.searchedHabits.shift();
            this.searchedHabits.push(this.AllHabits[i].name);
            this.searchView = true;
            return;
          }
        }
        this.searchView = false;
        this.notiftext = "Sorry, this habit is not yet supported";
        this.popnotif = true;
      }
    },
    async startTracking(habit) {
      const habits_lower = this.AccountHabits.map((x) => {
        return this.find_habit_name(x).toLowerCase();
      });
      const checkinHabits = habits_lower.includes(habit.toLowerCase());
      if (!checkinHabits) {
        let h_id = -1;
        this.AllHabits.map((h) => {
          if (h.name === habit) {
            h_id = h.habit_id;
          }
        });
        try {
          await axios.patch(`${API_HOST}/accountHabits`, { habit_id: h_id });
          console.log("Adding Habit");
          this.refreshAccountHabit();
        } catch (error) {
          console.log(error);
        }
      } else {
        this.notiftext = "you are already tracking this habit";
        this.popnotif = true;
      }
    },
    async refreshAccountHabit() {
      while (this.AccountHabits.length > 0) {
        this.AccountHabits.pop();
      }

      try {
        const res = await axios.get(`${API_HOST}/accountHabits`);
        res.data.habits.map((habit) => {
          habit.dialog = false;
          this.AccountHabits.push(habit);
        });
      } catch (error) {
        console.log(error);
      }
    },
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
.onehabit {
  font-size: 1.5rem;
  margin-left: auto;
}
#habits {
  display: flex;
  justify-content: center;
  align-items: center;
}
.closebutton {
  margin-left: auto;
  margin-right: 10px;
}
</style>
