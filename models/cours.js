const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coursSchema = new Schema({
  anneeAcademique: { type: String, required: true },
  eleve: { type: Schema.Types.ObjectId, ref: "Enfant", required: true },
  formateur: { type: Schema.Types.ObjectId, ref: "Personnel", required: true },
  classe: { type: String, required: true },
  matieres: [{ type: String, required: true }],
  prix: { type: Number, required: true },
  commission: { type: Number, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Parent", required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Cours", coursSchema);
