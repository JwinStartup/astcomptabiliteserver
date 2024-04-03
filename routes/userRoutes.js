const express = require("express");
const { requireAuth } = require("../Middleware/auth.js");


const router = express.Router();
//const auth = require("../middleware/auth");
const {
  inscription,
  inscriptionParent,
  inscriptionPersonnel,
  inscriptionEnfant,
  listeParent,
  listeEnfant,
  listePersonnel,
  connexion,
  deconnexion,
  lister,
  modifier,
  supprimerPersonnel,
  supprimerParent,
  supprimerEnfant,
  voirPersonnel,
  voirParent,
  voirEnfant,
  voir,
  modifierPersonnel,
  modifierParent,
  modifierEnfant,
  supprimer,
} = require("../Controllers/userController.js");
const auth = require("../Middleware/auth.js");

router.post("/inscription", inscription);
router.post("/modifier", modifier);
router.post("/inscriptionParent",auth, inscriptionParent);
router.post("/inscriptionEnfant",auth, inscriptionEnfant);
router.post("/inscriptionPersonnel",auth, inscriptionPersonnel);
router.get("/listeParent",auth,listeParent);
router.get("/listePersonnel",auth, listePersonnel);
router.get("/listeEnfant",auth, listeEnfant);
router.get("/supprimerEnfant/:id",auth, supprimerEnfant);
router.get("/supprimerPersonnel/:id",auth, supprimerPersonnel);
router.get("/supprimerParent/:id",auth, supprimerParent);
router.post("/modifierEnfant",auth, modifierEnfant);
router.post("/modifierPersonnel",auth, modifierPersonnel);
router.post("/modifierParent",auth, modifierParent);
router.get("/voirEnfant/:id",auth, voirEnfant);
router.get("/voirPersonnel/:id",auth, voirPersonnel);
router.get("/voirParent/:id",auth, voirParent);
router.get("/voir/:id",auth, voir);
router.get("/liste",auth, lister);
router.post("/connexion", connexion);
router.get("/deconnexion", deconnexion);

router.get("/supprimer/:id", supprimer);

module.exports = {
  routes: router,
};
