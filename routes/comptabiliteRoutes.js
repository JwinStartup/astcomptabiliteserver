const express = require("express");


const router = express.Router();
//const auth = require("../middleware/auth");
const {
  creerFacture,
  modifieFacture,
payerFacture,
supprimerFacture,
voirByIdFacture,
listeFacture,
voirByIdRecue,
listeRecue,
listeComission,
creerCharge,
listeCharge,
voirByIdBilan,
cloturer,
  partager,
listeBilan,
} = require("../Controllers/comptabiliteController.js");
const auth = require("../Middleware/auth.js");

/* ----------------------- facture ---------------------------------*/
router.post("/creerFacture",auth, creerFacture);
router.get("/listeFacture",auth, listeFacture);
router.post("/modifieFacture",auth, modifieFacture);
router.post("/payerFacture",auth, payerFacture);
router.get("/supprimerFacture/:id",auth, supprimerFacture);
router.get("/voirByIdFacture/:id", voirByIdFacture);

/* ----------------------- reçues ---------------------------------*/
router.get("/voirByIdRecue/:id", voirByIdRecue);
router.get("/listeRecue",auth, listeRecue);

/* ----------------------- commissions ---------------------------------*/
router.get("/listeComission",auth, listeComission);

/* ----------------------- Charges ---------------------------------*/
router.post("/creerCharge",auth, creerCharge);
router.get("/listeCharge",auth, listeCharge); 

/* ----------------------- Bilan ---------------------------------*/
router.post("/cloturer", cloturer);
router.get("/voirByIdBilan/:id",auth, voirByIdBilan); 
router.post("/partager",partager);
router.get("/listeBilan",auth, listeBilan);

module.exports = {
  routes: router,
};
