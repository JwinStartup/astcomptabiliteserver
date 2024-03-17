const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var personnelSchema = new Schema({
  nom: {
    type: String,
  },
  prenoms: {
    type: String,
  },
  email: {
    type: String,
  },
  whatshapp: {
    type: String,
  },
  ville: {
    type: String,
  },
  commune: {
    type: String,
  },
  cel: {
    type: String,
  },
  discipline: {
    type: String,
  },
  creerPar:{
    type:Schema.Types.ObjectId,
 ref:'User'
}


},
{
  timestamps: true
});

module.exports = mongoose.model("Personnel", personnelSchema);