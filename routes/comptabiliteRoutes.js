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
  voirTotal,
listeCharge,
voirByIdBilan,
  voirCharge,
  modifierCharge,
  supprimerCharge,
cloturer,
  partager,
listeBilan,
getFactureById,
payerEncoreFacture,
statistiqueFactures,
} = require("../Controllers/comptabiliteController.js");
const auth = require("../Middleware/auth.js");

/* ----------------------- facture ---------------------------------*/
router.post("/creerFacture",auth, creerFacture);
router.get("/listeFacture",auth, listeFacture);
router.post("/modifierFacture",auth, modifierFacture);
router.post("/payerFacture",auth, payerFacture);
router.post("/payerEncoreFacture",auth, payerEncoreFacture); 
router.get("/supprimerFacture/:id",auth, supprimerFacture);
router.get("/voirByIdFacture/:id", voirByIdFacture);
router.get("/factureById/:id",auth, getFactureById);
//statistiques des factures 
router.get("/statistiquesFactures/:periode",auth, statistiqueFactures);
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
router.get("/voirCharge/:id",auth, voirCharge); 

/* ----------------------- Bilan ---------------------------------*/
router.post("/cloturer", cloturer);
router.get("/voirByIdBilan/:id",auth, voirByIdBilan); 
router.post("/partager",partager);
router.get("/listeBilan",auth, listeBilan);
router.get("/voirTotal",auth, voirTotal);

module.exports = {
  routes: router,
};
