const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var commissionSchema = new Schema({
  montant: {
    type: Number,
  },

periode: {
    type: String,
  },
  periodeAjouter: {
    type: String,
  },
  creerPar:{
    type:Schema.Types.ObjectId,
 ref:'User'
},
  recue:{
    type:Schema.Types.ObjectId,
 ref:'Recue'
},
  client:{
    type:Schema.Types.ObjectId,
 ref:'Parent'
}
},
{
  timestamps: true
});

module.exports = mongoose.model("Commission", commissionSchema);