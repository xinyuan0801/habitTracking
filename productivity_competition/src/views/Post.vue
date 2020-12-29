<template>
  <v-app>
    <div id="header">
      <div id="opinfo">
        <v-layout>
          <v-menu bottom min-width="150px" rounded offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon x-large class="ml-2 mt-2" v-on="on">
                <v-avatar color="primary" size="56">VJ</v-avatar>
              </v-btn>
            </template>
            <v-card>
                <v-list-item-content>
                  <div class="text-center">
                    <v-avatar color="success">
                      <span class="white--text headline">{{ postinfo.avatar }}</span>
                    </v-avatar>
                    <h3>{{ postinfo.opname }}</h3>
                    <p class="caption mt-1">
                      {{ postinfo.email }}
                    </p>
                    <v-divider></v-divider>
                    <v-btn depressed rounded text to="/FriendProfile">
                      View profile
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-card>
          </v-menu>
          <span class="ml-5 mt-6 font-weight-medium">{{
            postinfo.opname
          }}</span>
          <v-spacer></v-spacer>
          <v-menu offset-y top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2 mr-5 mt-5"
                medium
                icon
                color="teal"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title
                  ><v-btn width="100%" @click="reportPost"
                    >Report this post</v-btn
                  ></v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-layout>
      </div>
      <div id="postcontent">
        <span>{{ postinfo.content }}</span>
      </div>
      <v-divider></v-divider>
      <div id="postinfo">
        <v-layout>
          <span class="grey--text mt-3">{{ postinfo.time }}</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            color="pink"
            large
            class="mt-1"
            @click="likePost"
            v-if="postinfo.liked == true"
          >
            <v-icon large>mdi-heart</v-icon>
          </v-btn>
          <v-btn
            icon
            large
            class="mt-1"
            @click="likePost"
            v-if="postinfo.liked == false"
          >
            <v-icon large>mdi-heart</v-icon>
          </v-btn>
          <span class="mt-3 mr-10">{{ postinfo.likes }}</span>
        </v-layout>
      </div>
      <v-divider></v-divider>
    </div>
    <div id="replies">
      <div id="reply" v-for="(reply, i) in replies" :key="i">
        <div id="forclick" @click="reply.subreply = !reply.subreply">
          <div id="replyavatar">
            <v-menu bottom min-width="150px" rounded offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon x-large class="ml-2 mt-2" v-on="on">
                  <v-avatar color="red" class="ml-1" size="55">
                    <span class="white--text headline">{{ reply.avatar }}</span>
                  </v-avatar>
                </v-btn>
              </template>
              <v-card>
                <v-list-item-content>
                  <div class="text-center">
                    <v-avatar color="success">
                      <span class="white--text headline">{{ reply.avatar }}</span>
                    </v-avatar>
                    <h3>{{ reply.name }}</h3>
                    <p class="caption mt-1">
                      {{ reply.email }}
                    </p>
                    <v-divider></v-divider>
                    <v-btn depressed rounded text to="/FriendProfile">
                      View profile
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
          </div>
          <div id="replycontent">
            <div id="replyinfo">
              <v-layout>
                <span class="mt-1 font-weight-medium">{{ reply.name }}</span>
                <span class="grey--text ml-2 mt-1">{{ reply.time }}</span>
                <v-spacer></v-spacer>
                <v-menu offset-y top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mr-5"
                      medium
                      icon
                      color="teal"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title
                        ><v-btn width="100%" @click.stop="reportPost"
                          >Report this post</v-btn
                        ></v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-layout>
            </div>
            <div id="replyDetail">
              <span class="font-weight-regular">{{ reply.content }}</span>
            </div>
            <div id="replyButtonGroup" class="mt-3">
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click.stop="likeReply(reply)"
                  v-if="reply.liked == false"
                >
                  <v-icon large>mdi-thumb-up-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click.stop="likeReply(reply)"
                  v-if="reply.liked != false"
                  color="deep-orange"
                >
                  <v-icon large>mdi-thumb-up-outline</v-icon>
                </v-btn>
                <span class="mt-1 mr-3 ml-1 font-weight-medium">{{
                  reply.likes
                }}</span>
                <v-btn
                  icon
                  color="blue"
                  @click.stop="reply.replyb = !reply.replyb"
                >
                  <v-icon large class="ml-2">mdi-message-outline</v-icon>
                </v-btn>
                <span class="mt-1 mr-5 ml-1 font-weight-medium">{{
                  reply.comments
                }}</span>
              </v-layout>
            </div>
          </div>
          <v-divider class="mt-3"></v-divider>
        </div>
        <transition name="scale-transition">
          <div v-if="reply.replyb == true">
            <v-text-field
              filled
              solo
              append-icon="mdi-reply"
              v-model="comment"
              @click:append="replyComment(reply)"
            ></v-text-field>
          </div>
        </transition>
        <transition name="fade-transition">
          <div id="subreply" v-if="reply.subreply == true">
            <div
              id="reply"
              v-for="(reply, i) in reply.subreplycontent"
              :key="i"
            >
              <div id="replyavatar">
                <v-menu bottom min-width="150px" rounded offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn icon x-large class="ml-2 mt-2" v-on="on">
                      <v-avatar color="red" class="ml-1" size="55">
                        <span class="white--text headline">{{
                          reply.avatar
                        }}</span>
                      </v-avatar>
                    </v-btn>
                  </template>
                  <v-card>
                <v-list-item-content>
                  <div class="text-center">
                    <v-avatar color="success">
                      <span class="white--text headline">{{ reply.avatar }}</span>
                    </v-avatar>
                    <h3>{{ reply.name }}</h3>
                    <p class="caption mt-1">
                      {{ reply.email }}
                    </p>
                    <v-divider></v-divider>
                    <v-btn depressed rounded text to="/FriendProfile">
                      View profile
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-card>
                </v-menu>
              </div>
              <div id="replycontent">
                <div id="replyinfo">
                  <v-layout>
                    <span class="mt-1 font-weight-medium">{{
                      reply.name
                    }}</span>
                    <span class="grey--text ml-2 mt-1">{{ reply.time }}</span>
                    <v-spacer></v-spacer>
                    <v-menu offset-y top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="mr-5"
                          medium
                          icon
                          color="teal"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-list-item-title
                            ><v-btn width="100%" @click="reportPost"
                              >Report this post</v-btn
                            ></v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-layout>
                </div>
                <div id="replyDetail">
                  <span class="font-weight-regular">{{ reply.content }}</span>
                </div>
                <div id="replyButtonGroup" class="mt-3">
                  <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      @click="likeReply(reply)"
                      v-if="reply.liked == false"
                    >
                      <v-icon large>mdi-thumb-up-outline</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      @click="likeReply(reply)"
                      v-if="reply.liked != false"
                      color="deep-orange"
                    >
                      <v-icon large>mdi-thumb-up-outline</v-icon>
                    </v-btn>
                    <span class="mt-1 mr-3 ml-1 font-weight-medium">{{
                      reply.likes
                    }}</span>
                    <v-btn
                      icon
                      color="blue"
                      @click="reply.subreply = !reply.subreply"
                    >
                      <v-icon large class="ml-2">mdi-message-outline</v-icon>
                    </v-btn>
                    <span class="mt-1 mr-5 ml-1 font-weight-medium">{{
                      reply.comments
                    }}</span>
                  </v-layout>
                </div>
              </div>
              <v-divider class="mt-3"></v-divider>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <v-snackbar v-model="popup">
      {{ popupText }}

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

    <div id="leftbar"></div>
    <div id="rightbar"></div>

    <div id="floatwidget">
      <v-btn color="indigo" fab x-large dark id="backbutton" to="/Forum">
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-btn>
      <transition name="scale-transition">
        <div id="replybar" v-if="replybarVisble == true">
          <v-text-field
            filled
            solo
            append-icon="mdi-reply"
            v-model="reply"
            @click:append="replyPost"
          ></v-text-field>
        </div>
      </transition>
      <v-divider vertical id="line1"></v-divider>
      <v-divider vertical id="line2"></v-divider>
      <v-btn
        fab
        dark
        x-large
        color="blue"
        id="replybarButton"
        @click="replybarVisble = !replybarVisble"
      >
        <v-icon> mdi-message-reply-text </v-icon>
      </v-btn>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      popupText: "",
      reply: "",
      comment: "",
      popup: false,
      dialog: false,
      timeout: 1000,
      replybarVisble: false,
      // will get all the json data below by server call and will get them in created() part of Vue,
      // meaning will get them when the page is created
      postinfo: {
        opname: "Evan You",
        likes: 300,
        time: "8:01 NOV 5 2020",
        content: "I prefer React",
        liked: false,
        email: "123@qq.com",
        avatar: "E",
      },
      replies: [
        {
          name: "CJ McCollum",
          avatar: "CJ",
          time: "7h",
          content: "I mean both are good choice",
          likes: 1,
          comments: 1,
          liked: false,
          email: "123@qq.com",
          subreply: false,
          replyb: false,
          subreplycontent: [
            {
              name: "John Wick",
              avatar: "JW",
              time: "2h",
              content: "Yes",
              likes: 0,
              comments: 1,
              liked: false,
              email: "123@qq.com",
            },
          ],
        },
        {
          name: "Bob Smith",
          avatar: "BS",
          time: "7h",
          content: "i found React is better at bigger project",
          likes: 0,
          comments: 1,
          liked: false,
          email: "123@qq.com",
          subreply: false,
          replyb: false,
          subreplycontent: [
            {
              name: "John Wick",
              avatar: "JW",
              time: "2h",
              content: "Yes",
              likes: 0,
              comments: 0,
              liked: false,
              email: "123@qq.com",
            },
          ],
        },
      ],
      user_info: {
        name: "Tim Horton",
        isSubscribed: false,
        avatar: "T",
        email: "123@qq.com",
      },
    };
  },
  methods: {
    likePost() {
      if (!this.postinfo.liked) {
        // over here, when like a post, will update this data in server
        // and also update the data store locally
        this.postinfo.likes++;
        this.postinfo.liked = true;
      } else {
        // over here, when remove like for a post, will update this data in server
        // and also update the data store locally
        this.postinfo.likes--;
        this.postinfo.liked = false;
      }
    },
    likeReply(reply) {
      // same as likeing a post
      if (!reply.liked) {
        reply.likes++;
        reply.liked = true;
      } else {
        reply.likes--;
        reply.liked = false;
      }
    },
    replyPost() {
      // when reply to a Post, will send this reply data to server to update and
      // also update the local data
      if (this.reply != "") {
        var d = new Date();
        var newP = new Object();
        newP.name = this.user_info.name;
        newP.avatar = this.user_info.avatar;
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
        newP.time = hour + ":" + min + " " + month + " " + date + " " + year;
        newP.content = this.reply;
        newP.likes = 0;
        newP.liked = false;
        newP.comments = 0;
        newP.email = "123@qq.com";
        this.replies.push(newP);
      } else {
        this.popupText = "mind reading failed, please use word";
        this.popup = true;
      }
    },
    reportPost() {
      // this will send the report to server and server will notify Admin side
      this.popupText = "Report has been sent to Admin";
      this.popup = true;
    },
    replyComment(reply) {
      if (this.comment != "") {
        var d = new Date();
        var newP = new Object();
        newP.name = this.user_info.name;
        newP.avatar = this.user_info.avatar;
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
        newP.time = hour + ":" + min + " " + month + " " + date + " " + year;
        newP.content = this.comment;
        newP.likes = 0;
        newP.liked = false;
        newP.comments = 0;
        reply.subreplycontent.push(newP);
      } else {
        this.popupText = "mind reading failed, please use word";
        this.popup = true;
      }
    },
  },
};
</script>

<style scoped>
#header {
  height: auto;
  max-height: 275px;
  min-height: 200px;
  width: 55%;
  margin-left: auto;
  margin-right: auto;
}
#opinfo {
  height: 90px;
}

#postcontent {
  min-height: 70px;
  max-height: 150px;
  font-size: 30px;
  margin-left: 10px;
  margin-right: 10px;
}

#postinfo {
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
}

#backbutton {
  position: fixed;
  top: 50px;
  left: 70px;
}

#replybar {
  width: 70%;
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 2;
}

#line1 {
  position: fixed;
  left: 22%;
  height: 100%;
  top: 0px;
  z-index: 1;
}

#line2 {
  position: fixed;
  right: 22%;
  height: 100%;
  top: 0px;
  z-index: 1;
}

#replies {
  height: 100%;
  margin-top: 20px;
  width: 53%;
  margin-left: auto;
  margin-right: auto;
}

#reply {
  min-height: 100px;
  margin-top: 10px;
  height: auto;
}

#replyavatar {
  width: 60px;
  height: 60px;
  float: left;
}

#replycontent {
  height: auto;
  max-height: 250px;
  width: auto;
  margin-left: 70px;
}

#replyinfo {
  height: 20px;
  margin-top: 10px;
}

#replyDetail {
  height: auto;
  margin-top: 10px;
}

#replyButtonGroup {
  height: 30px;
}

#leftbar {
  width: 22%;
  position: fixed;
  height: 100%;
  left: 0px;
  background-color: #f6fbfe;
}

#rightbar {
  width: 22%;
  position: fixed;
  height: 100%;
  right: 0px;
  background-color: #f6fbfe;
}

#replybarButton {
  position: fixed;
  right: 7%;
  bottom: 20%;
}

#subreply {
  margin-left: 50px;
}
</style>
