const express = require("express");
const router = express.Router();
const coursController = require("../controllers/coursController");
const auth = require("../Middleware/auth");

// Créer un cours
router.post("/",auth, coursController.createCours);

// Récupérer tous les cours
router.get("/",auth, coursController.getAllCours);

// Récupérer un cours par ID
router.get("/:id",auth, coursController.getCoursById);

// Mettre à jour un cours
router.put("/:id",auth, coursController.updateCours);

// Supprimer un cours
router.delete("/:id",auth, coursController.deleteCours);

module.exports = router;
