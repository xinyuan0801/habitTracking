<template>
  <div id="Stat">
    <v-layout class="fill-height">
      <v-card id="habitRecord">
        <v-tabs background-color="#0099CC" centered dark icons-and-text>
          <v-tabs-slider></v-tabs-slider>

          <v-tab>
            Habits Tracking
            <v-badge
              color="green"
              :value="normalNotComplete"
              :content="normalNotComplete"
              overlap
            >
              <v-icon>mdi-artstation</v-icon>
            </v-badge>
          </v-tab>

          <v-tab>
            Competition
            <v-badge
              color="green"
              :value="competitionHabits"
              :content="competitionHabits"
              overlap
            >
              <v-icon>mdi-nintendo-switch</v-icon>
            </v-badge>
          </v-tab>

          <v-tab>
            Completed Habits
            <v-badge
              color="green"
              :value="completedHabits"
              :content="completedHabits"
              overlap
            >
              <v-icon>mdi-check-bold</v-icon>
            </v-badge>
          </v-tab>
          <v-tab-item>
            <v-row justify="center" dense class="mt-2">
              <v-card
                color="primary"
                dark
                class="habits mt-2"
                v-for="habit in AccountHabits.filter(
                  (h) => h.competing === false && h.recorded_today === false
                )"
                :key="habit.habit_id"
              >
                <v-layout>
                  <v-checkbox
                    v-model="habit.recorded_today"
                    @click="toggle_recorded(habit)"
                    color="success"
                    hide-details
                    class="ml-2"
                  ></v-checkbox>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title
                        class="headline"
                        v-bind="attrs"
                        v-on="on"
                        @click="goToForum(findForum(habit))"
                      >
                        {{ find_habit_name(habit) }}
                      </v-card-title>
                    </template>
                    <span>Habit name</span>
                  </v-tooltip>

                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title class="headline" v-bind="attrs" v-on="on">
                        <span class="recordDay mr-2"> {{ habit.days }} </span>
                        days
                      </v-card-title>
                    </template>
                    <span>Record</span>
                  </v-tooltip>

                  <v-card-actions>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          @click="start_competing(habit)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-nintendo-game-boy</v-icon>
                        </v-btn>
                      </template>
                      <span>Join Competition</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          @click="stop_tracking(habit)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-tray-remove</v-icon>
                        </v-btn>
                      </template>
                      <span>Stop Tracking</span>
                    </v-tooltip>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-row></v-tab-item
          >
          <v-tab-item
            ><v-row justify="center" dense class="mt-2">
              <v-card
                color="#FC5185"
                dark
                class="habits mt-2"
                v-for="habit in AccountHabits.filter(
                  (h) => h.competing === true && h.recorded_today === false
                )"
                :key="habit.habit_id"
              >
                <v-layout>
                  <v-checkbox
                    v-model="habit.recorded_today"
                    @click="toggle_recorded(habit)"
                    color="success"
                    hide-details
                    class="ml-2"
                  ></v-checkbox>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title
                        class="headline"
                        v-bind="attrs"
                        v-on="on"
                        @click="goToForum(findForum(habit))"
                      >
                        {{ find_habit_name(habit) }}
                      </v-card-title>
                    </template>
                    <span>Habit name</span>
                  </v-tooltip>

                  <v-spacer></v-spacer>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title
                        class="headline mr-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        No. {{ find_placement(habit) }}
                      </v-card-title>
                    </template>
                    <span>Placement</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title class="headline" v-bind="attrs" v-on="on">
                        <span class="completeDay mr-2"> {{ habit.days }} </span>
                        days
                      </v-card-title>
                    </template>
                    <span>Record</span>
                  </v-tooltip>

                  <v-card-actions
                    ><v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon dark v-bind="attrs" v-on="on">
                          <v-icon large>
                            mdi-dots-horizontal
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon
                                ><v-icon
                                  large
                                  @click="stop_competing(habit)"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  mdi-exit-run
                                </v-icon></v-btn
                              >
                            </template>
                            <span>Quit the Competition</span>
                          </v-tooltip>
                        </v-list-item>
                        <v-list-item>
                          <v-dialog v-model="habit.dialog" width="500">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon v-bind="attrs" v-on="on">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon large v-bind="attrs" v-on="on">
                                      mdi-clipboard-list-outline
                                    </v-icon>
                                  </template>
                                  <span>Ranking List</span>
                                </v-tooltip>
                              </v-btn>
                            </template>

                            <v-card>
                              <v-card-title class="headline grey lighten-2">
                                {{ find_habit_name(habit) }}
                              </v-card-title>

                              <v-list-item
                                two-line
                                v-for="(competitor, i) in find_habit(habit)
                                  .competitions"
                                :key="i"
                              >
                                <v-list-item-content>
                                  <v-layout>
                                    <v-icon v-if="i === 0" class="ml-3 mr-6"
                                      >mdi-crown</v-icon
                                    >
                                    <span
                                      v-else
                                      class="ml-4 mr-8 mt-2 font-weight-bold"
                                    >
                                      {{ i + 1 }}</span
                                    >
                                    <div>
                                      <v-list-item-title>
                                        {{ competitor.days }} days
                                      </v-list-item-title>
                                      <v-list-item-subtitle
                                        class="accent--text text--darken-1"
                                      >
                                        {{ competitor.competitor_name }}
                                      </v-list-item-subtitle>
                                    </div>
                                  </v-layout>
                                </v-list-item-content>
                              </v-list-item>

                              <v-divider></v-divider>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="primary"
                                  text
                                  @click="habit.dialog = false"
                                >
                                  close
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-list-item>
                        <v-list-item>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="stop_tracking(habit)"
                              >
                                <v-icon large>mdi-tray-remove</v-icon>
                              </v-btn>
                            </template>
                            <span>Stop Tracking</span>
                          </v-tooltip>
                        </v-list-item>
                      </v-list>
                    </v-menu></v-card-actions
                  >
                </v-layout>
              </v-card>
            </v-row></v-tab-item
          >
          <v-tab-item
            ><v-row justify="center" dense class="mt-2">
              <v-card
                color="success"
                dark
                class="habits mt-2"
                v-for="habit in AccountHabits.filter(
                  (h) => h.competing === false && h.recorded_today === true
                )"
                :key="habit.habit_id"
              >
                <v-layout>
                  <v-checkbox
                    v-model="habit.recorded_today"
                    @click="toggle_recorded(habit)"
                    color="white"
                    hide-details
                    class="ml-2"
                  ></v-checkbox>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title
                        class="headline"
                        v-bind="attrs"
                        v-on="on"
                        @click="goToForum(findForum(habit))"
                      >
                        {{ find_habit_name(habit) }}
                      </v-card-title>
                    </template>
                    <span>Habits name</span>
                  </v-tooltip>

                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title class="headline" v-bind="attrs" v-on="on">
                        <span class="finishedHabit mr-2">
                          {{ habit.days }}
                        </span>
                        days
                      </v-card-title>
                    </template>
                    <span>Record</span>
                  </v-tooltip>
                </v-layout>
              </v-card>
              <v-card
                color="orange"
                dark
                class="habits mt-2"
                v-for="habit in AccountHabits.filter(
                  (h) => h.competing === true && h.recorded_today === true
                )"
                :key="habit.habit_id"
              >
                <v-layout>
                  <v-checkbox
                    v-model="habit.recorded_today"
                    @click="toggle_recorded(habit)"
                    color="white"
                    hide-details
                    class="ml-2"
                  ></v-checkbox>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title
                        class="headline"
                        v-bind="attrs"
                        v-on="on"
                        @click="goToForum(findForum(habit))"
                      >
                        {{ find_habit_name(habit) }}
                      </v-card-title>
                    </template>
                    <span>Habit name</span>
                  </v-tooltip>

                  <v-spacer></v-spacer>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title
                        class="headline mr-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        No. {{ find_placement(habit) }}
                      </v-card-title>
                    </template>
                    <span>Placement</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-card-title class="headline" v-bind="attrs" v-on="on">
                        <span class="finishedHabit mr-2">
                          {{ habit.days }}
                        </span>
                        days
                      </v-card-title>
                    </template>
                    <span>Record</span>
                  </v-tooltip>
                </v-layout>
              </v-card>
            </v-row></v-tab-item
          >
        </v-tabs>
      </v-card>
      <v-card id="forumEntrance">
        <v-card-title primary-title class="justify-center"
          ><div><h2 class="headline">Joined Fourm</h2></div></v-card-title
        >
        <v-container fluid>
          <v-row justify="center" v-for="forum in forums" :key="forum.name">
            <v-btn
              depressed
              color="success"
              class="mt-2"
              @click="goToForum(forum)"
            >
              {{ forum.name }}
            </v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import ENV from "../../views/config.js";
const API_HOST = ENV.api_host;
export default {
  name: "homeStat",
  props: ["AccountHabits", "AllHabits", "forums", "account"],
  data() {
    return {
      userData: null,
    };
  },
  created() {},
  computed: {
    normalNotComplete: function() {
      let cList = this.AccountHabits.filter(
        (h) => h.competing !== true && h.recorded_today === false
      );
      return cList.length;
    },
    competitionHabits: function() {
      let cList = this.AccountHabits.filter(
        (h) => h.competing === true && h.recorded_today === false
      );
      return cList.length;
    },
    completedHabits: function() {
      let cList = this.AccountHabits.filter((h) => h.recorded_today === true);
      return cList.length;
    },
  },
  methods: {
    find_placement(AccountHabit) {
      const habit = this.AllHabits.find(
        (habit) => habit.habit_id === AccountHabit.habit_id
      );
      let p = 1;
      habit.competitions.forEach((competitor) => {
        if (competitor.days > AccountHabit.days) {
          p++;
        }
      });
      return p;
    },
    find_habit(AccountHabit) {
      return this.AllHabits.find(
        (habit) => habit.habit_id === AccountHabit.habit_id
      );
    },
    find_habit_name(AccountHabit) {
      return this.find_habit(AccountHabit).name;
    },
    async start_competing(AccountHabit) {
      AccountHabit.competing = true;
      AccountHabit.account_id = this.account.account_id;
      // patching account habit
      try {
        await axios.patch(
          `${API_HOST}/account/habit/${AccountHabit.habit_id}`,
          AccountHabit
        );
        console.log("start competing");
      } catch (error) {
        console.log(error);
      }

      try {
        // getting account data
        const competitor = {
          competitor_id: this.account.account_id,
          competitor_name: this.account.name,
          days: AccountHabit.days,
        };
        // adding account to habit competition leadeerboard
        const res2 = await axios.patch(
          `${API_HOST}/habit/competitions/${AccountHabit.habit_id}`,
          competitor
        );
        console.log("added to leaderboard");
        this.find_habit(AccountHabit).competitions =
          res2.data.habit.competitions; // update local leaderboard
      } catch (error) {
        console.log(error);
      }
    },
    async stop_competing(AccountHabit) {
      AccountHabit.competing = false;
      AccountHabit.account_id = this.account.account_id;
      try {
        await axios.patch(
          `${API_HOST}/account/habit/${AccountHabit.habit_id}`,
          AccountHabit
        );
        console.log("stop competing");
      } catch (error) {
        console.log(error);
      }
      try {
        const res2 = await axios.delete(
          `${API_HOST}/habit/competitions/${AccountHabit.habit_id}`
        );
        console.log("removed from leaderboard");
        this.find_habit(AccountHabit).competitions =
          res2.data.habit.competitions; // update local leaderboard
      } catch (error) {
        console.log(error);
      }
    },
    async toggle_recorded(AccountHabit) {
      AccountHabit.days = AccountHabit.recorded_today
        ? AccountHabit.days + 1
        : AccountHabit.days - 1;
      AccountHabit.account_id = this.account.account_id;
      // AccountHabit.account_id = this.userData.account_id
      try {
        await axios.patch(
          `${API_HOST}/account/habit/${AccountHabit.habit_id}`,
          AccountHabit
        );
        console.log("Habit recorded days updated");
      } catch (error) {
        console.log(error);
      }

      if (AccountHabit.competing) {
        const competitor = {
          competitor_id: this.account.account_id,
          competitor_name: this.account.name,
          days: AccountHabit.days,
        };
        try {
          const res = await axios.patch(
            `${API_HOST}/habit/competitions/u/${AccountHabit.habit_id}`,
            competitor
          );
          this.find_habit(AccountHabit).competitions =
            res.data.habit.competitions; // update local leaderboard
        } catch (error) {
          console.log(error);
        }
      }
    },
    async stop_tracking(AccountHabit) {
      try {
        await axios.delete(
          `${API_HOST}/account/habit/${AccountHabit.habit_id}`
        );
        console.log("Habit deleted from account");
      } catch (error) {
        console.log(error);
      }

      // remove from leaderboard
      if (AccountHabit.competing) {
        try {
          await axios.delete(
            `${API_HOST}/account/habit/${AccountHabit.habit_id}`
          );
          console.log("removed from leaderboard");
        } catch (error) {
          console.log(error);
        }
      }
      this.refreshAccountHabit();
    },

    findForum(AccountHabit) {
      return this.forums.find(
        (forum) => forum.name === this.find_habit_name(AccountHabit)
      );
    },

    goToForum(forum) {
      this.$router.push({
        path: forum.url,
        query: { userid: this.account.account_id },
      });
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
#Stat {
  height: 100%;
  width: 100%;
}
#habitRecord {
  height: 100%;
  width: 90%;
}
#forumEntrance {
  height: 100%;
  width: 30%;
}
.habits {
  width: 95%;
  height: auto;
}
.recordDay {
  color: #2bb709;
  font-weight: bold;
  font-size: 50px;
}
.completeDay {
  color: #b9d7e8;
  font-weight: bold;
  font-size: 50px;
}
.finishedHabit {
  font-weight: bold;
  font-size: 50px;
}

#toDoHabits {
  height: auto;
}

#completedHabits {
  height: auto;
}
</style>
