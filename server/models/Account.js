/* Account mongoose model */
const mongoose = require('mongoose')

const HabitSchema = mongoose.Schema({
    habit_id: {
      type: Number,
      required: true
    },
    days: {
      type: Number,
      required: true,
      default: 0
    },
    competing: {
      type: Boolean,
      required: true,
      default: false
    },
    recorded_today: {
      type: Boolean,
      required: true,
      default: false
    }
})

const Accountschema = mongoose.Schema({
  account_id: Number,
  name: {
    type: String,
    default: "User"
  },
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
}, {collection : 'Accounts'})

module.exports = mongoose.model("Accounts", Accountschema);
