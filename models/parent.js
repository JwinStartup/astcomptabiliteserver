const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var parentSchema = new Schema({
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
  cel: {
    type: String,
  },
  montantCours: {
    type: String,
  },
  commission: {
    type: String,
  },
  ville: {
    type: String,
  },
  commune: {
    type: String,
  },
  quartier: {
    type: String,
  },
  nombreEnfant: {
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

module.exports = mongoose.model("Parent", parentSchema);
