const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bilanSchema = new Schema({
  resultat: {
    type: Number,
  },
  totalCharge: {
    type: Number,
  },
  totalCommission: {
    type: Number,
  },
  factureImpaye: {
    type: Number,
  },
  facturePartielpayer: {
    type: String,
  },
  factureResteapayer: {
    type: String,
  },

anneeAcademique: {
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