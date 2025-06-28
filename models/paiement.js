const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var paiementSchema = new Schema({
  anneeAcademique: {
    type: String,
  },
  montantPaye : {
    type: Number,
    default: 0,
  },
 facture:{
    type:Schema.Types.ObjectId,
 ref:'Facture'
},
refPaiement: {
    type: String,
  },
periode: {
    type: String,
  },

  modePaiement: {
    type: String,
  },
  creerPar:{
    type:Schema.Types.ObjectId,
 ref:'User'
},
  client:{
    type:Schema.Types.ObjectId,
 ref:'Parent'
}
},
{
  timestamps: true
});

module.exports = mongoose.model("Paiement", paiementSchema);