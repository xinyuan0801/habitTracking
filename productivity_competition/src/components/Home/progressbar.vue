<template>
  <div id="f">
    <v-footer class="font-weight-medium">
      <v-row>
        <v-col class="text-center" cols="10">
          <v-progress-linear
            v-model="knowledge"
            height="35"
            id="progress"
            class="mt-1"
          >
            <strong>{{ Math.ceil(knowledge) }}%</strong>
          </v-progress-linear>
        </v-col>
        <v-col class="text-center mt-2 habitsCompleted" cols="2">Habits completed: {{completed_habits}}/{{total_habits}}  </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "progressbar",
  props: ["AccountHabits"],
  data() {
    return {
    };
  },
  computed: {
    total_habits() {
      return this.AccountHabits.length
    },
    completed_habits() {
      return this.AccountHabits.filter(h => h.recorded_today).length
    },
    knowledge() {
      return this.completed_habits*100/this.total_habits
    },
  },
};
</script>

<style scoped>
#progress {
  width: 100%;

}
#f {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
