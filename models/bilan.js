const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bilanSchema = new Schema({
  facturesPaye: {
    type: Number,
    default: 0
  },
  facturesImpaye: {
    type: Number,
    default: 0
  },
  facturesEnpartie: {
    type: Number,
    default: 0
  },
  totalResteApayer: {
    type: Number,
    default: 0
  },
  totalCommissionCoursDomicile: {
    type: Number,
    default: 0
  },
  totalCharge: {
    type: Number,
    default: 0
  },
  totalRecettes: {
    type: Number,
    default: 0
  },
  beneficeNet: {
    type: Number,
    default: 0
  },
  annee: {
    type: String,
    required: true
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