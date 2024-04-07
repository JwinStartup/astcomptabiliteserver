const express = require("express");


const router = express.Router();
//const auth = require("../middleware/auth");
const {
  creerFacture,
  modifierFacture,
payerFacture,
supprimerFacture,
voirByIdFacture,
listeFacture,
voirRecueByid,
listeRecue,
listeComission,
creerCharge,
listeCharge,
voirByIdBilan,
  modifierCharge,
  supprimerCharge,
cloturer,
  partager,
listeBilan,
} = require("../Controllers/comptabiliteController.js");
const auth = require("../Middleware/auth.js");

/* ----------------------- facture ---------------------------------*/
router.post("/creerFacture",auth, creerFacture);
router.get("/listeFacture",auth, listeFacture);
router.post("/modifierFacture",auth, modifierFacture);
router.post("/payerFacture",auth, payerFacture);
router.get("/supprimerFacture/:id",auth, supprimerFacture);
router.get("/voirByIdFacture/:id", voirByIdFacture);

/* ----------------------- reçues ---------------------------------*/
router.get("/voirRecueByid/:id", voirRecueByid);
router.get("/listeRecue",auth, listeRecue);

/* ----------------------- commissions ---------------------------------*/
router.get("/listeComission",auth, listeComission);

/* ----------------------- Charges ---------------------------------*/
router.post("/creerCharge",auth, creerCharge);
router.get("/listeCharge",auth, listeCharge); 
router.post("/modifierCharge",auth, modifierCharge);
router.get("/supprimerCharge/:id",auth, supprimerCharge); 

/* ----------------------- Bilan ---------------------------------*/
router.post("/cloturer", cloturer);
router.get("/voirByIdBilan/:id",auth, voirByIdBilan); 
router.post("/partager",partager);
router.get("/listeBilan",auth, listeBilan);

module.exports = {
  routes: router,
};
