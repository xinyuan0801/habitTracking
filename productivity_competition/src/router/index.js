import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import UserProfile from '../views/UserProfile.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import forumpage from '../views/Forum.vue'
import Post from '../views/Post.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/userprofile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Forum',
    name: 'Forum',
    component: forumpage
  },
  {
    path: '/Forum/?id=0',
    name: 'runningForum',
    component: forumpage,
    props: true
  },
  {
    path: '/Forum/?id=1',
    name: 'pushupForum',
    component: forumpage,
    props: true
  },
  {
    path: '/Forum/?id=2',
    name: 'drawingForum',
    component: forumpage,
    props: true
  },
  {
    path: '/Post',
    name: 'Post',
    component: Post
  },

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
