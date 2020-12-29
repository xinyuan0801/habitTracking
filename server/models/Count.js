const mongoose = require('mongoose')

const Countschema = mongoose.Schema({
  id: String,
  count: Number,
}, {collection : 'Count'})

module.exports = mongoose.model("Count", Countschema);
