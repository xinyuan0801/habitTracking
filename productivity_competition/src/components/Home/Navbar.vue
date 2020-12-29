<template>
    <nav>
        <v-toolbar class="primary">
                <v-btn x-large text class="white--text custom-btn" to="/home">
                    <span>Habit </span>
                    <span class="font-weight-light">Challenger</span>
                </v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary--text text--darken-1" to="/UserProfile">
                <span>Profile</span>
                <v-icon right>account_circle</v-icon>
            </v-btn>
            <v-btn depressed class="ml-5" color="primary--text text--darken-1" v-on:click="logout">
                <span>Logout</span>
                <v-icon right>login</v-icon>
            </v-btn>
        </v-toolbar>
    </nav>
</template>


<script>
import axios from 'axios'
export default {
  name: 'NavBar',
  methods: {
    async logout() {
      await localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      this.$router.push({name: 'Login'})
    }
  },
}
</script>
<style scoped>
    .custom-btn::before {
        color: transparent;
    }
</style>
