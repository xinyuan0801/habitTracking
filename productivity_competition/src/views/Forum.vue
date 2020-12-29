<template>
  <v-app v-if="loaded == true">
    <div>
      <Navbar />
      <div id="header">
        <v-layout id="info">
          <v-layout id="foruminfo">
            <img
              src="@/assets/logo.png"
              alt=""
              id="logo"
              height="100px"
              width="100px"
            />

            <div id="info_text">
              <h3 class="headline mb-0">{{ forum.title }}</h3>
              <p>{{ forum.description }}</p>
            </div>
          </v-layout>

          <v-card
            dark
            id="followers"
            width="270px"
            height="70px"
            v-bind:color="isSubscribed ? 'success' : 'dark'"
          >
            <v-card-title primary-title class="justify-center">
              <div>
                <p>Followers: {{ this.followers_count }}</p>
              </div>
            </v-card-title>
          </v-card>
          <v-btn
            large
            id="follow"
            rounded
            @click="subscribe"
            v-if="isSubscribed == false"
            :ripple="false"
            color="error"
            >follow <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            large
            id="follow"
            rounded
            @click="subscribe"
            :ripple="false"
            v-if="isSubscribed == true"
            >followed <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <v-divider></v-divider>
      <div id="searchbar">
        <v-text-field
          solo
          label="Search for Post"
          append-icon="mdi-magnify"
          @click:append="searchPost"
          v-model="searchContent"
        ></v-text-field>
      </div>
      <transition name="fade-transition">
        <div id="postarea" v-if="searchView == false">
          <div id="posts" v-for="post in neoPost" :key="post.liked">
            <v-hover>
              <v-card
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 7 : 2}`"
                class="mx-auto"
                color="#85C1E9"
                dark
                id="singlepost"
                :ripple="false"
              >
                <v-list-item>
                  <v-layout>
                    <p class="postfont">{{ post.title }}</p>
                  </v-layout>
                </v-list-item>

                <v-card-actions>
                  <v-list-item class="grow">
                    <v-menu bottom min-width="150px" rounded offset-y>
                      <template v-slot:activator="{ on }">
                        <v-btn icon x-large v-on="on">
                          <v-avatar color="teal" size="55">
                            <span class="white--text headline">{{
                              post.avatar
                            }}</span>
                          </v-avatar>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-list-item-content>
                          <div class="text-center">
                            <v-avatar color="success">
                              <span class="white--text headline">{{
                                post.avatar
                              }}</span>
                            </v-avatar>
                            <h3>{{ post.op_name }}</h3>
                            <p class="caption mt-1">
                              {{ post.email }}
                            </p>
                            <v-divider></v-divider>
                            <v-btn depressed rounded text to="/FriendProfile">
                              View profile
                            </v-btn>
                          </div>
                        </v-list-item-content>
                      </v-card>
                    </v-menu>

                    <v-list-item-content>
                      <v-layout>
                        <p class="username">{{ post.op_name }}</p>
                      </v-layout>
                    </v-list-item-content>

                    <v-layout align-center justify-end>
                      <p class="posttimefont">{{ post.date }}</p>
                      <v-btn
                        icon
                        v-if="post.liked == true"
                        class="mr-2"
                        :ripple="false"
                      >
                        <v-icon
                          class="mr-1"
                          size="50"
                          color="red"
                          @click.stop="likes(post)"
                          >mdi-heart</v-icon
                        >
                      </v-btn>
                      <v-btn
                        icon
                        v-if="post.liked == false"
                        class="mr-2"
                        :ripple="false"
                      >
                        <v-icon class="mr-1" size="50" @click.stop="likes(post)"
                          >mdi-heart</v-icon
                        >
                      </v-btn>

                      <span class="headline">{{ post.likes }}</span>

                    </v-layout>
                  </v-list-item>
                </v-card-actions>
              </v-card>
            </v-hover>
          </div>
        </div>
      </transition>

      <div id="postarea" v-if="searchView == true">
        <div id="returnButton">
          <v-btn depressed color="primary" @click="searchView = false">
            Exit from Search results
          </v-btn>
        </div>
        <div id="searchnotif" v-if="searchContent == ''">
          <p>No search result</p>
        </div>
        <div id="posts" v-for="(post, i) in searchedPost" :key="i">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 7 : 2}`"
              class="mx-auto"
              color="#85C1E9"
              dark
              id="singlepost"
              :ripple="false"
            >
              <v-list-item>
                <v-layout>
                  <p class="postfont">{{ post.title }}</p>
                </v-layout>
              </v-list-item>

              <v-card-actions>
                <v-list-item class="grow">
                  <v-menu bottom min-width="200px" rounded offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn icon x-large v-on="on">
                        <v-avatar color="teal" size="55">
                          <span class="white--text headline">{{
                            post.avatar
                          }}</span>
                        </v-avatar>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-list-item-content class="justify-center">
                        <div class="mx-auto text-center">
                          <v-avatar color="teal">
                            <span class="white--text headline">{{
                              post.avatar
                            }}</span>
                          </v-avatar>
                          <h3>{{ post.op_name }}</h3>
                          <p class="caption mt-1">
                            {{ post.email }}
                          </p>
                          <v-divider class="my-3"></v-divider>
                          <v-btn depressed rounded text to="/FriendProfile">
                            View profile
                          </v-btn>
                          <v-divider class="my-3"></v-divider>
                        </div>
                      </v-list-item-content>
                    </v-card>
                  </v-menu>

                  <v-list-item-content>
                    <v-layout>
                      <p class="username">{{ post.op_name }}</p>
                    </v-layout>
                  </v-list-item-content>

                  <v-layout align-center justify-end>
                    <p class="posttimefont">{{ post.date }}</p>
                    <v-btn
                      icon
                      v-if="post.liked == true"
                      class="mr-2"
                      :ripple="false"
                    >
                      <v-icon
                        class="mr-1"
                        size="50"
                        color="red"
                        @click.stop="likes(post)"
                        >mdi-heart</v-icon
                      >
                    </v-btn>
                    <v-btn
                      icon
                      v-if="post.liked == false"
                      class="mr-2"
                      :ripple="false"
                    >
                      <v-icon class="mr-1" size="50" @click.stop="likes(post)"
                        >mdi-heart</v-icon
                      >
                    </v-btn>

                    <span class="headline">{{ post.likes }}</span>
                  </v-layout>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-hover>
        </div>
      </div>

      <div id="newpostbtn">
        <v-dialog v-model="dialog" persistent max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              fab
              button
              color="blue"
              x-large
              v-bind="attrs"
              v-on="on"
              id="newpost"
            >
              <v-icon size="60">add</v-icon>
            </v-btn>
          </template>
          <v-card id="newpostpop">
            <v-card-title>
              <span class="headline">New post</span>
            </v-card-title>
            <v-container>
              <v-form v-on:submit.prevent>
                <v-textarea
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Details"
                  v-model="postDetails"
                  outlined
                  auto-grow
                  max-height="600px"
                  rows="7"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="280"
                ></v-textarea>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                    Close
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    type="submit"
                    @click="newPost"
                  >
                    Post
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
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
      <div id="filter">
        <v-menu offset-y top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              large
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark> mdi-sort </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title
                ><v-btn @click="sortByLikes" width="100%"
                  >Sort by Likes</v-btn
                ></v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-btn @click="sortByTime"
                  >Sort by latest</v-btn
                ></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div id="rankingList">
        <v-card class="mx-auto">
          <v-card-title class="justify-center">Ranking List</v-card-title>
          <v-list-item
            two-line
            v-for="(man, index) in rankingList"
            :key="index"
          >
            <v-list-item-content>
              <v-layout>
                <v-icon class="ml-3" v-if="index == 0">mdi-crown</v-icon>
                <span class="ml-5 mt-2 font-weight-bold" v-if="index != 0">{{
                  index+1
                }}</span>
                <div class="ml-3" v-if="index == 0">
                  <v-list-item-title class="mt-1"
                    >{{ man.days }} Days</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    man.competitor_name
                  }}</v-list-item-subtitle>
                </div>
                <div class="ml-5" v-if="index != 0">
                  <v-list-item-title class="mt-1"
                    >{{ man.days }} Days</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    man.competitor_name
                  }}</v-list-item-subtitle>
                </div>
              </v-layout>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>

      <div id="forumDescription">
        <v-card>
          <v-card-title> Learning Vue.js </v-card-title>
          <v-card-text>
            {{ forum.longDescription }}
          </v-card-text>
        </v-card>
      </div>

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
  </v-app>
</template>

<script>
import jwt from "jwt-decode";
import Navbar from "../components/Home/Navbar.vue";
import axios from "axios";
import ENV from "./config.js";
const API_HOST = ENV.api_host;
export default {
  name: "App",
  props: ["userid"],
  components: {
    Navbar,
  },
  data() {
    return {
      loaded: false,
      dialog: false,
      searchView: false,
      popnotif: false,
      notiftext: "",
      searchContent: "",
      timeout: 1000,
      rules: {
        required: (value) => !!value || "needs to have something to post",
        counter: (value) => value.length <= 280 || "Max 280 characters",
      },
      postDetails: "",
      // will get all the json data below by server call and will get them in created() part of Vue,
      // meaning will get them when the page is created
      forum: null,
      followers_count: null,
      isSubscribed: null,
      neoPost: null,
      rankingList: null,
      searchedPost: [],
      habit: null,
      popnotif2: false,
      notiftext2: ""
    };
  },

  async mounted() {
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

    await this.loadForum();
    await this.loadUserinfo();
    let userinfo = this.user_info;
    this.neoPost.forEach(function(p) {
      if (userinfo.postliked.includes(p._id)) {
        p["liked"] = true;
      } else {
        p["liked"] = false;
      }
    });
    this.loaded = true;
  },
  methods: {
    // the update of subscribe status will be sent to server and update the data on server
    // also the local data will be updated
    async loadForum() {
      const habitId = this.$route.query.id;

      let habitUrl = `${API_HOST}/habit/` + habitId;
      const res = await axios.get(habitUrl);
      this.forum = res.data.forum;
      this.habit = res.data.habits;
      this.neoPost = this.forum.posts;

      this.followers_count = this.forum.followers.length;
      this.rankingList = res.data.competitions;
      this.rankingList.sort(function(a, b) {
        return b.days - a.days;
      });
      this.rankingList = this.rankingList.slice(0, 5);
    },

    async subscribe() {
      if (!this.isSubscribed) {
        this.followers_count++;
        this.isSubscribed = true;
        let subscribeUrl =
          `${API_HOST}/addFollowersToForum/` + this.$route.query.id;
        let subscribeUser = {
          id: this.user_info.account_id,
        };
        await axios.patch(subscribeUrl, subscribeUser);
      } else {
        this.followers_count--;
        this.isSubscribed = false;
        let unsubscribeUrl =
          `${API_HOST}/removeFollowersToForum/` + this.$route.query.id;
        let unsubscribeUser = {
          id: this.$route.query.userid,
        };
        await axios.patch(unsubscribeUrl, unsubscribeUser);
      }
    },
    checkLiked(post) {
      if (this.user_info.postliked.includes(post._id)) {
        return true;
      }
      return false;
    },

    async loadUserinfo() {
      let userUrl = `${API_HOST}/account/`;
      const res = await axios.get(userUrl);
      this.user_info = res.data;
      this.isSubscribed = this.checkIfSubscribed(this.forum.followers);
    },

    checkIfSubscribed(followers) {
      const habitId = this.user_info.account_id;
      return followers.includes(habitId);
    },
    // the new Post data will be sent to server and update the date on server
    // also the local data will be updated by obtain from server
    async newPost() {
      if (this.postDetails != "") {
        const uId = this.$route.query.userid;
        var d = new Date();
        var newP = new Object();
        newP.avatar = this.user_info.avatar;
        newP.op_name = this.user_info.name;
        newP.title = this.postDetails;
        newP.likes = 0;
        newP.poster_id = uId;
        this.dialog = false;
        this.notiftext = "post successful";
        this.popnotif = true;
        var months = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ];
        var hour = d.getHours().toString();
        var min = d.getMinutes().toString();
        var year = d.getFullYear().toString();
        var month = months[d.getMonth()];
        var date = d.getDate().toString();
        newP.date = hour + ":" + min + " " + month + " " + date + " " + year;
        let addPostUrl = `${API_HOST}/habit/forum/` + this.$route.query.id;
        await axios.patch(addPostUrl, newP);
        this.$router.go();
      } else {
        this.notiftext = "mind reading failed, please use word";
        this.popnotif = true;
      }
    },
    // send the new status of likes of post and update the data on server
    // also update the local data will be updated by obtain from server
    likes(post) {
      let postId = post._id;
      if (post.liked == false) {
        let addedPost = {
          id: postId,
        };
        post.liked = true;
        post.likes++;
        let likePostUrl = `${API_HOST}/accountLikePost`;
        let addlikeUrl = `${API_HOST}/likePost/` + this.$route.query.id;
        axios.patch(likePostUrl, addedPost);
        axios.patch(addlikeUrl, addedPost);
      } else {
        let unlikePostUrl = `${API_HOST}/accountUnlikePost`;
        let minuslikeUrl = `${API_HOST}/unlikePost/` + this.$route.query.id;
        let unlikePost = {
          id: postId,
        };
        post.likes--;
        post.liked = false;
        axios.patch(unlikePostUrl, unlikePost);
        axios.patch(minuslikeUrl, unlikePost);
      }
      this.$forceUpdate();
    },
    sortByLikes() {
      this.neoPost.sort(function(a, b) {
        return b.likes - a.likes;
      });
    },
    sortByTime() {
      this.neoPost.sort(function(a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
      });
    },
    searchPost() {
      var result = [];
      this.searchView = true;
      for (var i = 0; i < this.forum.posts.length; i++) {
        if (
          this.forum.posts[i].title
            .toUpperCase()
            .includes(this.searchContent.toUpperCase()) &&
          this.searchContent != ""
        ) {
          result.push(this.forum.posts[i]);
        }
      }
      this.searchedPost = result;
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
#info_card {
  margin-top: 8px;
  margin-left: 30px;
}

#info {
  margin-top: 5px;
}

#follow {
  position: absolute;
  right: 3%;
  margin-top: 21px;
}

#followers {
  position: absolute;
  right: 15%;
  margin-top: 10px;
  border-radius: 50px;
}

#info_text {
  margin-left: 30px;
  margin-top: 10px;
}

#searchbar {
  width: 58%;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}

#singlepost {
  margin-top: 12.5px;
  margin-bottom: 12.5px;
  height: auto;
  width: 57%;
}

#filter {
  position: fixed;
  bottom: 27%;
  right: 5.7%;
}

#newpost {
  position: fixed;
  bottom: 15%;
  right: 6%;
}

#postarea {
  height: auto;
}

#postContent {
  margin-left: 20px;
}

#newpostpop {
  border-radius: 30px;
}

p.username {
  font-family: Verdana, sans-serif;
  color: black;
  margin-left: 6px;
  font-weight: bold;
  margin-top: 5px;
}

p.postfont {
  font-family: Noto Sans, sans-serif;
  font-size: 33px;
  color: black;
}

#header {
  height: 100px;
}

#foruminfo {
  margin-left: 15%;
}

#rankingList {
  position: fixed;
  width: 15%;
  height: 50%;
  left: 3%;
  top: 25%;
}

p.posttimefont {
  color: whitesmoke;
  margin-top: 20px;
  margin-right: 30px;
}

#forumDescription {
  width: 20%;
  position: fixed;
  right: 0.5%;
  top: 25%;
}

#returnButton {
  margin-left: 39%;
  margin-top: 10px;
}

#searchnotif {
  margin-left: 46%;
  margin-top: 20px;
}
</style>
