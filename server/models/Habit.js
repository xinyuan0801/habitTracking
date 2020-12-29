const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    commenter_id: {
      type: Number,
      required: true
    },
    likes: {
      type: Number,
      required: true,
      default: 0
    },
    date: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
})

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  poster_id: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  op_name: {
    type: String,
    required: true,
  },
  comments: [CommentSchema]
})

const ForumSchema = mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    longDescription: String,
    rankings: String,
    followers: Array,
    posts: [PostSchema]
})

const CompetitionSchema = mongoose.Schema({
    competitor_id: {
      type: Number,
      required: true
    },
    competitor_name: {
      type: String,
      required: true
    },
    days: {
      type: Number,
      required: true
    }
})

const HabitsSchema = mongoose.Schema({
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
}, {collection : 'Habits'})

module.exports = mongoose.model("Habits", HabitsSchema);
