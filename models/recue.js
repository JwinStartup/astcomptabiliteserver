const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var recueSchema = new Schema({
  montant: {
    type: Number,
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
  periodeAjouter: {
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

module.exports = mongoose.model("Recue", recueSchema);