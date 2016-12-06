var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pollSchema = new Schema(
  {
    id: String,
    question: String,
    answers: Array,
    authorId: String,
  }
);

var Polls = mongoose.model('Polls', pollSchema);

module.exports = Polls;
