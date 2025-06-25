const Cours = require("../models/cours");
const Parent = require("../models/parent");

// Créer un cours
exports.createCours = async (req, res) => {
  try {
    const data = { ...req.body, creerPar: req.user };
    // Recherche du parent par id
    const parent = await Parent.findById(data.parentId);
    if (!parent) {
      return res.status(404).json({ error: "Parent non trouvé" });
    }
    // Création du cours
    const cours = await Cours.create(data);
    // Ajout du cours dans le parent
    if (!parent.cours) parent.cours = [];
    parent.cours.push(cours._id);
    await parent.save();
    res.status(201).json(cours);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer tous les cours
exports.getAllCours = async (req, res) => {
  try {
    const cours = await Cours.find({ creerPar: req.user })
      .populate("eleve")
      .populate("parent")
      .populate("formateur");
    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un cours par ID
exports.getCoursById = async (req, res) => {
  try {
    const cours = await Cours.findOne({ _id: req.params.id, creerPar: req.user })
      .populate("eleve")
      .populate("parent")
      .populate("formateur");
    if (!cours) return res.status(404).json({ error: "Cours non trouvé" });
    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un cours
exports.updateCours = async (req, res) => {
  try {
    const cours = await Cours.findOneAndUpdate(
      { _id: req.params.id, creerPar: req.user },
      req.body,
      { new: true }
    );
    if (!cours) return res.status(404).json({ error: "Cours non trouvé" });
    res.json(cours);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un cours
exports.deleteCours = async (req, res) => {
  try {
    const cours = await Cours.findOneAndDelete({ _id: req.params.id, creerPar: req.user });
    if (!cours) return res.status(404).json({ error: "Cours non trouvé" });
    res.json({ message: "Cours supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
