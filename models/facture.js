const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var factureSchema = new Schema({
  montant: {
    type: Number,
    default: 0,
  },
  anneeAcademique: {
    type: String,
  },
  montantPayer: {
    type: Number,
    default: 0,
  },
  resteApayer: {
    type: Number,
    default: 0,
  },
  periode: {
    type: String,
  },
   type: {
    type: String,
  },

  cours:[{
    type: Schema.Types.ObjectId,
    ref: 'Cours'
  }],
  creerPar:{
    type:Schema.Types.ObjectId,
 ref:'User'
},
paiement:[{
  type: Schema.Types.ObjectId,
  ref: 'Paiement'
}],
  client:{
    type:Schema.Types.ObjectId,
 ref:'Parent'
}
},
{
  timestamps: true
});

module.exports = mongoose.model("Facture", factureSchema);
