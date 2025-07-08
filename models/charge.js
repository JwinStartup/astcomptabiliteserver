const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var chargeSchema = new Schema({
  montant: {
    type: Number,
  },

  observation: {
    type: String,
  },
  type: {
    type: String,
  },
  anneeAcademique: {
    type: String,
  },
  periode: {
    type: String,
  },
  nomCharge: {
    type: String,
  },
  creerPar:{
    type:Schema.Types.ObjectId,
 ref:'User'
},
personnel:{
    type: String,
}
},
{
  timestamps: true
});

module.exports = mongoose.model("Charge", chargeSchema);