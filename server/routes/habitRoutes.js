const express = require("express");
const { ObjectID } = require("mongodb");
const { Mongoose } = require("mongoose");

const router = express.Router();
const Accounts = require("../models/Account");
const Habits = require("../models/Habit");
const Count = require("../models/Count");

const { mongoChecker, isMongoError } = require("./helpers/helpers");

const passport = require("passport");
const authenticate = passport.authenticate("jwt", { session: false });

const log = console.log;

/* <--- Get an habit---> */

/// Route getting a specific habit.
// GET /habit/id (id for the habit)
// note : dont forget the req.body!
router.get("/habit/:id", mongoChecker, authenticate, async (req, res) => {
  const habitId = req.params.id;
  try {
    let habit = await Habits.findOne({ habit_id: habitId });
    res.send(habit);
  } catch (error) {
    res.status(400).send("Bad Request");
  }
});

// post a new habit.
router.post("/habit", mongoChecker, authenticate, async (req, res) => {
  // log(req.body)

  const forum = {
    title: "Forum for " + req.body.name,
    description: req.body.caption,
    longDescription: req.body.longDescription,
    rankings: "", //ask what ranking should be
  };

  const count = await Count.findOne({ id: "habit_count" });
  // Create a new student using the Student mongoose model
  const habit = new Habits({
    habit_id: count.count,
    name: req.body.name,
    caption: req.body.caption,
    competitions: [],
    forum: forum,
    //creator: req.user._id // creator id from the authenticate middleware
  });

  try {
    await Count.updateOne({ id: "habit_count" }, { $inc: { count: 1 } });
    const result = await habit.save();
    res.send(result);
  } catch (error) {
    log(error); // log server error to the console, not to the client.
    if (isMongoError(error)) {
      // check for if mongo server suddenly dissconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
    }
  }
});

//get all habits
router.get("/habits", mongoChecker, async (req, res) => {
  try {
    const habits = await Habits.find();
    res.send(habits);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//get specific habit
router.get("/habits/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  try {
    const habits = await Habits.find({ habit_id: id });
    res.send(habits);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//get a habit's rankings
router.get(
  "/habitLeaderboard/:id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const id = req.params.id;

    try {
      const habit = await Habits.findOne({ habit_id: id }).select(
        "competitions -_id"
      );
      if (!habit) {
        res.status(404).send("Resource not found");
      } else {
        res.send(habit);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//delete habit by id
router.delete("/habit/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Delete a habit by their id
  try {
    const habit = await Habits.findOneAndRemove({ habit_id: id });
    if (!habit) {
      res.status(404).send();
    } else {
      res.send(habit);
    }
  } catch (error) {
    log(error);
    res.status(500).send(); // server error, could not delete.
  }
});

/* <--- Update subdocumetns of Habit---> */

/// Route for adding 1 to the like field of Post in forum.
/* 
Request body expects:
{
	"id": String| id of Post
}
*/
// POST /likePost/id (id for the Habit)
// note : dont forget the req.body!
router.patch("/likePost/:id", mongoChecker, authenticate, async (req, res) => {
  // Update the student by their id.
  const id = req.params.id;
  const postId = req.body.id;
  const habit = await Habits.findOne({ habit_id: id });
  try {
    habit.forum.posts.forEach(function (post) {
      if (post._id == postId) {
        post.likes++;
      }
    });
    let result = {
      id: postId,
      habit_info: habit,
    };
    res.send(result);
    habit.save();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/* <--- Update subdocumetns of Habit---> */

/// Route for minus 1 to the like field of Post in forum.
/* 
Request body expects:
{
	"id": String| id of Post
}
*/
// POST /unlikePost/id (id for the Habit)
// note : dont forget the req.body!
router.patch(
  "/unlikePost/:id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    // Update the student by their id.
    const id = req.params.id;
    const postId = req.body.id;
    try {
      const habit = await Habits.findOne({ habit_id: id });
      habit.forum.posts.forEach(function (post) {
        if (post._id == postId) {
          post.likes--;
        }
      });
      let result = {
        id: postId,
        habit_info: habit,
      };
      res.send(result);
      habit.save();
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

/* <--- Update subdocumetns of Forum---> */

/// Route for add post to forum.
/* 
Request body expects:
{
  "likes": Number| likes of the post,
  "title": String| the content of post,
  "avatar": String| the pic of user,
  "poster_id": String| the id of poster,
  "op_name": String| the name of OP,
  "date": String| time when the post is made
}
*/
// POST /habit/forum/id (id for the event)
// note : dont forget the req.body!

//add post to forum
router.patch(
  "/habit/forum/:id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const id = req.params.id;

    // Find the fields to update and their values.
    const post = {
      id: req.body.id,
      avatar: req.body.avatar,
      title: req.body.title,
      date: req.body.date,
      poster_id: req.body.poster_id,
      op_name: req.body.op_name,
      likes: req.body.likes,
      avatar: "c",
      comments: [],
    };

    const forum = await Habits.findOne({ habit_id: id });

    if (!forum) {
      res.status(404).send("Resource not found");
    } else {
      forum.forum.posts.push(post);
      await forum.save();
      let result = {
        id: req.body.id,
        pos: post,
      };
      res.send(result);
    }
  }
);

//get all posts for a forum
router.get("/posts/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send("");
    return;
  }

  try {
    const forum = await Habits.findOne({ _id: id }, { forum: 1 });
    if (!forum) {
      res.status(404).send("Resource not found");
    } else {
      res.send(forum.forum.posts);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/* <--- Update subdocumetns of Habit---> */

/// Route for adding followers to Forum.
/* 
Request body expects:
{
	"id": String| the id of user that follow
}
*/
// PATCH /addFollowersToForum/id (id for the Habit)
router.patch(
  "/addFollowersToForum/:id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const habitId = req.params.id;
    let newUser = req.body.id;
    let habit = await Habits.findOne({ habit_id: habitId });
    habit.forum.followers.push(newUser);
    habit.save();
    let result = {
      id: newUser,
      forum: habit.forum,
    };
    res.send(result);
  }
);

/* <--- Update subdocumetns of Habit---> */

/// Route for removing followers from forum.
/* 
Request body expects:
{
	"id": String| the id of user that follow
}
*/
// PATCH /removeFollowersToForum/id (id for the Habit)
router.patch(
  "/removeFollowersToForum/:id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    try {
      const habitId = req.params.id;
      let removeUser = req.body.id;
      let habit = await Habits.findOne({ habit_id: habitId });
      habit.forum.followers = habit.forum.followers.filter(function (follower) {
        return follower != removeUser;
      });
      habit.save();
      let result = {
        id: newUser,
        forum: habit.forum,
      };
      res.send(result);
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request");
      }
    }
  }
);

router.patch(
  "/habit/forum/post/:id/:post_id",
  mongoChecker,
  async (req, res) => {
    const id = req.params.id;
    const post_id = req.params.post_id;

    if (!(ObjectID.isValid(id) && ObjectID.isValid(post_id))) {
      res.status(404).send();
      return;
    }

    // Find the fields to update and their values.
    const comment = {
      commenter_id: req.body.commenter_id,
      date: req.body.date,
      content: req.body.content,
    };

    // Update the student by their id.
    try {
      const forum = await Habits.findOne({ _id: id }, { forum: 1 });
      if (!forum) {
        res.status(404).send("Resource not found");
      } else {
        forum.forum.posts = forum.forum.posts.map((post) => {
          if (post._id == post_id) {
            post.comments.push(comment);
          }
          return post;
        });
        await forum.save();
        res.send(comment);
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request");
      }
    }
  }
);

//get all comments on a post
router.get(
  "/comments/:id/:post_id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const id = req.params.id;
    const post_id = req.params.post_id;

    if (!(ObjectID.isValid(id) && ObjectID.isValid(post_id))) {
      res.status(404).send();
      return;
    }

    try {
      const forum = await Habits.findOne({ _id: id }, { forum: 1 });
      if (!forum) {
        res.status(404).send("Resource not found");
      } else {
        const post = forum.forum.posts.filter((post) => {
          if (post._id == post._id) {
            return post;
          }
        })[0];
        if (!post) {
          res.status(404).send("Resource not found");
        } else {
          res.send(post.comments);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//add competitor to habit
/*
Request body expects:
{
  "competitor_id": <id of the account>
  "competitor_name": <name of the account>
  "days": <number of days of the habit>
}
*/
router.patch(
  "/habit/competitions/:habit_id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const habit_id = req.params.habit_id;

    // Find the fields to update and their values.
    const competitor = {
      competitor_id: req.body.competitor_id,
      competitor_name: req.body.competitor_name,
      days: req.body.days,
    };

    try {
      const habit = await Habits.findOneAndUpdate(
        { habit_id: habit_id },
        {
          $push: { competitions: { $each: [competitor], $sort: { days: -1 } } },
        }
      );
      if (!habit) {
        res.status(404).send("Resource not found");
      } else {
        res.send({ competitor, habit });
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the student.
      }
    }
  }
);

//remove competitor from habit
router.delete(
  "/habit/competitions/:habit_id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const habit_id = req.params.habit_id;
    const id = req.user._id;

    try {
      const account = await Accounts.findOne({
        creator: id,
        "habits.habit_id": habit_id,
      });
      if (!account) {
        res.status(404).send("Resource not found"); // could not find this account.
      } else {
        const account_id = account.account_id;
        // Update the Habit so user is no longer competing in habit
        const habit = await Habits.findOneAndUpdate(
          { habit_id: habit_id },
          { $pull: { competitions: { competitor_id: account_id } } }
        );
        if (!habit) {
          res.status(404).send("Resource not found"); //could not find this habit
        } else {
          res.send({ account, habit });
        }
      }
    } catch (error) {
      console.log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the competitor
      }
    }
  }
);

// update competitor for habit
/*
Request body expects:
{
  competitor_id: int｜ id of the account
  competitor_name: string | name of the account
  days: int | number of days of the habit
}
*/
router.patch(
  "/habit/competitions/u/:habit_id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const habit_id = req.params.habit_id;

    const competitor = {
      competitor_id: req.body.competitor_id,
      competitor_name: req.body.competitor_name,
      days: req.body.days,
    };

    // Update the student by their id.
    try {
      const habit = await Habits.findOneAndUpdate(
        {
          habit_id: habit_id,
          "competitions.competitor_id": competitor.competitor_id,
        },
        { $set: { "competitions.$": competitor } },
        { new: true, useFindAndModify: false }
      );
      if (!habit) {
        res.status(404).send("Resource not found");
      } else {
        res.send({ competitor, habit });
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the student.
      }
    }
  }
);

//get all competitors in a habit
router.get(
  "/competitions/:id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      res.status(404).send("");
      return;
    }

    try {
      const competitors = await Habits.findOne(
        { _id: id },
        { competitions: 1 }
      );
      if (!competitors) {
        res.status(404).send("Resource not found");
      } else {
        res.send(competitors.competitions);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//add comment to post
router.patch(
  "/habit/forum/post/:id/:post_id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const id = req.params.id;
    const post_id = req.params.post_id;

    if (!(ObjectID.isValid(id) && ObjectID.isValid(post_id))) {
      res.status(404).send();
      return;
    }

    // Find the fields to update and their values.
    const comment = {
      commenter_id: req.body.commenter_id,
      date: req.body.date,
      content: req.body.content,
    };

    // Update the student by their id.
    try {
      const forum = await Habits.findOne({ _id: id }, { forum: 1 });
      if (!forum) {
        res.status(404).send("Resource not found");
      } else {
        forum.forum.posts = forum.forum.posts.map((post) => {
          if (post._id == post_id) {
            post.comments.push(comment);
          }
          return post;
        });
        await forum.save();
        res.send(comment);
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request");
      }
    }
  }
);

module.exports = router;
