const express = require("express");
const { requireAuth } = require("../Middleware/auth.js");


const router = express.Router();
//const auth = require("../middleware/auth");
const {
  inscription,
  inscriptionParent,
  inscriptionPersonnel,
  listeParent,
  listePersonnel,
  connexion,
  deconnexion,
  modifierRole,
  lister,
  supprime,
} = require("../controllers/userController.js");
const auth = require("../Middleware/auth.js");

router.post("/inscription", inscription);
router.post("/inscriptionParent",auth, inscriptionParent);
router.post("/inscriptionPersonnel",auth, inscriptionPersonnel);
router.get("/listeParent",auth,listeParent);
router.get("/listePersonnel",auth, listePersonnel);
//router.get("/lister", lister);
router.post("/connexion", connexion);
router.get("/deconnexion", deconnexion);
//router.post("/modifierRole", modifierRole);
//router.get("/supprime/:id", supprime);

module.exports = {
  routes: router,
};