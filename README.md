# Habit Challenger

link : https://peaceful-fjord-41441.herokuapp.com/
The link is currently offline.

The website will provide users a way to keep track of their habits, and compete their own record with others. Also a forum is provided for users to chat and exchange their experience.
this web app is made with Vue.js

### Role of the User:
Users that want to have fun with other people while keeping a habit would use this app. Users are able to pick a habit,
then compete with other users who can keep their habits the longest. Leaderboards are also included to fuel the competition.
Users who want to share their experiences in keeping a habit can use the forum feature, where other users will share their habit keeping journey.
Users who want to quietly keep habits can also opt out of competition mode.

### Libraries:
- Vue cli 3
- Vue-Router
- Vuetify
- Material design icon
- Concurrently 
- Bcyptjs
- Cors
- Express
- Jsonwebtoken
- Mongodb
- Mongoose
- Nodemon
- Passport
- Passport-jwt
- Axios
- Core-js
- jwt-decode

## How to Use App
### Login View:
The starting page for the application where users and admins login
![alt text](https://i.imgur.com/rjarSIo.png "Login")

#### Feature supported:
- Enter username and password to login message is displayed if account does not exist
- if the correct login is given and is an admin account then routed to admin page
- if correct login is given and is normal user the routed to home page and session is created
- if you do not have an account click create account button and account is created
- If username already exists popup notification displayed

### Home View:
You can view most of your habits here
![alt text](https://i.imgur.com/QQjfI6b.png "Login")

#### Feature supported:
- Search to add new habits for tracking
- press the left box to say you finished your habit
- There will be 3 seperate tabs, showing non-competing unfinished habit, competing unfinished habit, and finished habit
- There are buttons on the right of each habit to:
- - join/quit competition
- - Stop tracking an habit and delete the data
- - Show leaderboard (only on competition tab)
- A slideshow on the right to show random habits.


### User Profile:
You can view your information here. 
![alt text](https://i.imgur.com/x0inv95.png "Login")
#### Feature supported:

You can edit your name by clicking [edit]. 
It lists all the information of habits that you are currently tracking.
 By clicking on [Submit New Habit] located at the side menu on the left, you can open up a form. 
You can fill in the form then click [submit] to create a new habit. 
Creating a habit is not tracking a habit. Once you create a habit, it will be available within the search feature in Home for you to later track. 
Other users can search for the habit that you have created as well. 
Creating a habit automatically creates the associated forum.

### Forum:
where users with same Habits recorded can chat.
![alt text](https://i.imgur.com/TymJusW.png "Login")

#### Feature supported:
Follow the Forum by clicking the follow button
Like button
Followers count widget showing the number of followers
Ranking list widget of the habit of this Forum
Sort posts by Comments or Likes
Add new post
Search for post
more user info when click the profile picture of user

### Admin:
You can view all the users and habits that are currently in use.
![alt text](https://i.imgur.com/PPnurPV.png "Login")

#### Feature supported:
In the ‘User Listing’, you can ban or delete users by clicking on the appropriate buttons located below the listing. 
Banning a user will prevent them from creating habits in the future
Deleting a user removes their account from the app. 
In the ‘Habit Listing’, you can delete any habits by clicking on [delete] located below the listing. 
Deleted habits cannot be used for any purposes such as tracking, searching, and forum interactions.

## User Routes:
Account objects have their own id called ‘account_id’.
### Get
```
/allAccount
	Returns: all account objects in the database.
```
```
/account
	Returns: account of the user in session.
```
```
/getAccount/:id
	params.id = account_id  (the id is referring to account_id).
	Returns: account with the account_id.
```
```
/accountBanned/:id
	params.id = account_id
	Returns: ‘banned’ field of account with the account_id. 
```
```
/accountHabits
	Returns: habits of the account (of the user in session).
```

```
/habit/:id
	params.id = the id of a habit
	Expects: {
    habit_id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    caption: String,
    longDescription: String,
    competitions: [CompetitionSchema],
    forum: {
      type: ForumSchema,
      required: true
    	}
	Returns:the entire JSON object of this habit.
```



### Delete
```
/account/:id
	params.id = account_id
	Returns: the account that was deleted.
```
```
/account/habit/:habitID
	params.habitID = habit_id
	Returns: the habit that is deleted, and the account itself
```
 
### Patch
```
/accountHabits
    user._id = id
    Expects: {habit_id: int | <id of the habit>}
    Returns: the account the habit that has been added to
```
```
/account/:id
	params.id = account_id
    Expects: [{"op":"some operation", "path":"/somePath", "value":”some value“}]
    Returns: the account that was patched.
```
```
/accountAdmin/:id
	params.id = account_id 
	Expects: [{"op":"some operation", "path":"/somePath", "value":”some value“}]
R   eturns: the account that was patched.
```
```
/accountUP
	Expects: [{"op":"some operation", "path":"/somePath", "value":”some value“}]
Returns: the account that was patched.
```
```
/account/habit/:habitID
	user._id = id
	params.habitID = habitID
	Expects: {
	"account_id": int | <id of the account>
	"competing": boolean
	"recorded_today": boolean
	"days": int | <number of days>
	}
	Returns: habit that has been added, and the account that has been added to
```

```
/accountLikePost
Request body expects:
{
"id": String| id of Post
}
Expects: {
“id”: id of poster,
User: {
	{
  account_id: Number,
  name: String,
  banned: Boolean,
  habits: {
    type: [HabitSchema],
    default: []
  },
  postliked: Array,
  creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
     }
}
}
	Returns: the postid that liked and user(in the session)’s JSON object.
```

```
/accountUnlikePost
	Request body expects:
{
"id": String| id of Post
}
Expects: {
“id”: id of poster,
User: {
	{
  account_id: Number,
  name: String,
  banned: Boolean,
  habits: {
    type: [HabitSchema],
    default: []
  },
  postliked: Array,
  creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
     }
}
}
	Returns: the postid that unliked and user(in the session)’s JSON object.
```


## Habit Routes

### Get
```
/habit:id
	params.id = habit_id
Returns: habit with the habit_id. 
```
```
/habits
	Returns: All the habit objects in the database.
```
```
/habits:id (seems to be the same thing as /habit:id ?)
	params.id = habit_id
Returns: habit with the habit_id. 
```
```
/habitLeaderboard/:id
	params.id = habit_id
	Returns: competition field of the habit.
```
```
/posts/:id
	parms.id = habit_id
	Returns: all the posts of the habit.
```
```
/comments/:id/:post_id
	params.id = habit_id
params.post_id =  the post_id that is within the habit object
Returns: get all comments of the post.
```
```
/competitions/:id
	params.id = habit_id
	Returns: competition field of the habit.
```

### Post
```
/habit
	Expects: {
		name: String,
		caption: String,
		longDescription: String
	}
	Returns: the created habit.
```

### Delete
```
/habit/:id
	params.id = habit_id
	Returns: deleted habit
```
```
/habit/competitions/:habit_id
	params.id = habit_id
	Returns: the habit that the competitor was removed from.
```

### Patch

```
/likePost/:id
Request body expects:
{
	"id": String| id of Post
}
	params.id = id of the Habit the post is under
	Expects: {
	Id: the id of the post liked,
	User: {
	The habit JSON object of post is under
}
}
Returns: the id of post liked and the user(in the session) JSON object. 
```
```
/unlikePost/:id
	Request body expects:
{
	"id": String| id of Post
}
	params.id = id of the Habit the post is under
	Expects: {
	Id: the id of the post liked,
	User: {
	{
  account_id: Number,
  name: String,
  banned: Boolean,
  habits: {
    type: [HabitSchema],
    default: []
  },
  postliked: Array,
  creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
     }

}
}
Returns: the id of post unliked and the user(in the session) JSON object. 
```
```
/habit/forum/:id
	Params.id = post_id (the id for the new post that is being added)
	Expects: {
"likes": Number| likes of the post,
"title": String| the content of post,
"avatar": String| the pic of user,
"poster_id": String| the id of poster,
"op_name": String| the name of OP,
"date": String| time when the post is made
	}
	Returns: id of the forum and the post
/addFollowersToForum/:id
	param.id = habitId
	Expects: { “id”: int |  <account_id of the follower> }
	Returns: id of the follower and the forum
/removeFollowersToForum/:id
	param.id = habitId
	Expects: { “id”: int |  <account_id of the follower> }
	Returns: id of the follower and the forum
/habit/forum/post/:id/:post_id
	param.id = id
	params.post_id = post_id
	Expects: {
		“commenter_id”: int | <account_id of the commenter>
		“date”: string | <date of the comment is posted>
		“content”: string | <content of the comment>
}
Return : the comment that has been added
```
```
/habit/competitions/:habit_id 
	Adding competitor to habit
	params.habit_id = habit_id
	Expects: {
  "competitor_id": int |  <account_id of the competitor>
  "competitor_name": string | <name of the account>
  "days": int | <number of days of the habit>
	}
	Returns: {
		Competitor that has been added, and the habit the competitor has be added to
	}
```
```
/habit/competitions/u/:habit_id
	Updating competitor on habit
	params.habit_id = habit_id
	Expects: {
  "competitor_id": int |  <id of the account>
  "competitor_name": string | <name of the account>
  "days": int | <number of days of the habit>
	}
	Returns: {
		Competitor that has been added, and the habit the competitor has be added to
	}
```
