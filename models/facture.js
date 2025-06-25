const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var factureSchema = new Schema({
  montant: {
    type: Number,
  },
  anneeAcademique: {
    type: String,
  },
  resteApayer: {
    type: Number,
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
recues:[{
  type: Schema.Types.ObjectId,
  ref: 'Recue'
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
