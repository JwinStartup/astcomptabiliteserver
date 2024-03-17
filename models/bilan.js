const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bilanSchema = new Schema({
  recette: {
    type: Number,
  },
  charge: {
    type: Number,
  },
  commission: {
    type: Number,
  },
  resultat: {
    type: Number,
  },
  statut: {
    type: String,
  },

periode: {
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

module.exports = mongoose.model("Bilan", bilanSchema);