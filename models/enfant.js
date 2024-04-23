const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var enfantSchema = new Schema({
  nom: {
    type: String,
  },
  prenoms: {
    type: String,
  },
  ville: {
    type: String,
  },
  genre: {
    type: String,
  },
  cel: {
    type: String,
  },
  commune: {
    type: String,
  },
  quartier: {
    type: String,
  },
 
  classe: {
    type: String,
  },
  formateur:[{
    type:Schema.Types.ObjectId,
 ref:'Personnel'
}],
  creerPar:{
    type:Schema.Types.ObjectId,
 ref:'User'
},
  parent:{
    type:Schema.Types.ObjectId,
 ref:'Parent'
}
},
{
  timestamps: true
});

module.exports = mongoose.model("Enfant", enfantSchema);
