<template>
    <div id="rankingList">
        <v-carousel
        v-model="model"
        hide-delimiter-background
        delimiter-icon="mdi-minus"
        :show-arrows="false"
        height="100%"
        cycle
        >
            <v-carousel-item v-for="(habit, i) in ThreeRandomHabits" :key="i">
                <v-sheet :color="colors[i]" height="100%" tile>
                <v-col class="fill-height" align="center" justify="center">
                    <div class="display-3 my-5">{{ habit.name }}</div>
                    <v-list-item
                    two-line
                    v-for="(competitor, i) in habit.competitions"
                    :key="competitor.placement"
                    >
                    <v-list-item-content class="my-1">
                        <v-layout>
                        <v-icon
                            v-if="i === 0"
                            class="ml-2 mr-6"
                            >mdi-crown</v-icon
                        >
                        <span
                            v-else
                            class="ml-4 mr-8 font-weight-bold text-left"
                        >
                            {{ i+1 }}</span
                        >
                        <div>
                            <v-list-item-title>
                            {{ competitor.days }} days
                            </v-list-item-title>
                            <v-list-item-subtitle
                            class="grey--text text--lighten-2 text-left"
                            >
                            {{ competitor.competitor_name }}
                            </v-list-item-subtitle>
                        </div>
                        </v-layout>
                    </v-list-item-content>
                    </v-list-item>
                </v-col>
                </v-sheet>
            </v-carousel-item>
        </v-carousel>
    </div>
</template>

<script>
export default {
  name: "RankingList",
  props: ["ThreeRandomHabits"],
  data() {
    return {
      model: 0,
      colors: ["primary", "secondary", "yellow darken-2"],
      top_competitions: [
        {
          name: "Learn Vue.js",
          competitors: [
            { name: "Someone", placement: 1, record: 96 },
            { name: "Maybe", placement: 2, record: 92 },
            { name: "Name", placement: 3, record: 87 },
            { name: "Jerry", placement: 4, record: 86 },
            { name: "Rick", placement: 5, record: 82 },
            { name: "Morty", placement: 6, record: 77 },
            { name: "Stan", placement: 7, record: 76 },
            { name: "Kyle", placement: 8, record: 72 },
            { name: "Eric", placement: 9, record: 67 },
          ],
        },
        {
          name: "Running",
          competitors: [
            { name: "Jerry", placement: 1, record: 104 },
            { name: "Rick", placement: 2, record: 101 },
            { name: "Morty", placement: 3, record: 99 },
          ],
        },
        {
          name: "Drawing",
          competitors: [
            { name: "Stan", placement: 1, record: 45 },
            { name: "Kyle", placement: 2, record: 41 },
            { name: "Eric", placement: 3, record: 39 },
          ],
        },
      ],
    };
  },
}
</script>