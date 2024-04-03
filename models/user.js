const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
  nom: {
    type: String,
  },
  zone: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  }, 
  role: {
    type: String,
  },
  cel: {
    type: String,
  },

},
{
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
