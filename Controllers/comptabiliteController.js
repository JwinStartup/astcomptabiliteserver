const Facture = require("../models/facture.js");
const Paiement = require("../models/paiement.js");
const Commission = require("../models/commission.js");
const Parent = require("../models/parent.js");
const Bilan = require("../models/bilan.js");
const Charge = require("../models/charge.js");
const moment = require("moment")
const axios = require("axios");
const { patch } = require("../routes/cours.js");
const cours = require("../models/cours.js");
const charge = require("../models/charge.js");
const periode=`${moment(new Date()).locale('fr').format("MMM")}  ${moment(new Date()).locale('fr').format("YYYY")}`
 
    /* ----------------------- facture ---------------------------------*/
    const creerFacture= async (req, res, next) => {
        try {
            console.log('body:',req.body)
            const facture = await new Facture(
                {
                    montant: req.body.montant,
                    periode: req.body.periode,
                    client: req.body.client,
                    creerPar:req.user,
                    cours:req.body.cours,
                    anneeAcademique:req.body.anneeAcademique,
                    type:"impaye"
      }
      )
      .save()
      console.log(facture)
      res.json(facture)

  } catch (error) {
    res.json({message:error});
}
}
//facture by id : getFactureById
const getFactureById = async (req, res, next) => {
    try {
        console.log("params getFactureById:",req.params.id)
        const facture = await Facture.findById(req.params.id)
        .populate(
            {
                path: "client", // correction ici
            }
        )
        .populate({
            path: "paiement", // correction ici
            populate: { path: "client" }
        
        })
        console.log("la facture:",facture)
        res.status(200).json(facture)
    } catch (error) {
        res.json({message:error});
    }
        
}
const listeFacture= async (req, res, next) => {
    try {
        const liste= await Facture.find({creerPar:req.user}).sort({'updatedAt': -1}).populate("client").populate({
          path: "cours",
          populate: { path: "eleve" }
        })
     console.log(liste)
        res.status(200).json(liste)
    } catch (error) {
        res.json({message:error});
    }
}
const modifierFacture= async (req, res, next) => {
try{    
 console.log(req.body)
 const update= {
                    montant: req.body.montant,
                    periodeAjouter:req.body.periodeAjouter,
               }
    const facture = await Facture.findByIdAndUpdate(req.body._id, update).then(()=>res.json({message:'success'}))
  }catch(error){
        console.log(error)
    }
}
const payerFacture= async (req, res, next) => {
    console.log(req.body)
    try{
        // Vérification du montant
        const montant = Number(req.body.montantPayer);
        if (isNaN(montant) || montant <= 0) {
            return res.status(400).json({ message: "Le montantPaye est invalide ou manquant." });
        }

        //creer un nouveau recue et enregistre le montant payer et le mode de paiement
        console.log({
            montantPaye: montant,
            anneeAcademique:req.body.anneeAcademique,
            facture: req.body.idFacture,
            periode: req.body.periode,
            refPaiement: req.body.ref,
            modePaiement: req.body.mode,
            creerPar: req.user,
            client: req.body.client
        })
        const paiement = await new Paiement({
            montantPaye: montant,
            anneeAcademique:req.body.anneeAcademique,
            facture: req.body.idFacture,
            periode: req.body.periode,
            refPaiement: req.body.ref,
            modePaiement: req.body.mode,
            creerPar: req.user,
            client: req.body.client
        }).save()
        console.log(paiement)

        const facture = await Facture.findById(req.body.idFacture)
        if (!facture.montantPayer) {
            facture.montantPayer = 0
        }

        if (paiement) {
            // mettre a jour la facture
            facture.montantPayer += montant
            facture.resteApayer = facture.montant - facture.montantPayer
            facture.paiement.push(paiement._id)
            facture.type = req.body.type
            await facture.save().then((doc) => {
                console.log(doc)
            })
        }
        res.status(200).json(facture)
    }catch(error){
        console.log(error)
    }
}
const payerEncoreFacture= async (req, res, next) => {
    console.log(req.body)
    try{
        //creer un nouveau recue et enregistre le montant payer et si le reste a payer est 0 
        //alors on change le type de la facture en totalite sinon on laisse le type en enpartie
        console.log({
                montantPaye: req.body.montantPaye,
                anneeAcademique:req.body.anneeAcademique,
                facture: req.body.idFacture,
                periode: req.body.periode,
                refPaiement: req.body.ref,
                modePaiement: req.body.mode,
                creerPar: req.user,
                client: req.body.client
            })
        const paiement = await new Paiement({
                montantPaye: req.body.montantPaye,
                anneeAcademique:req.body.anneeAcademique,
                facture: req.body.idFacture,
                periode: req.body.periode,
                refPaiement: req.body.ref,
                modePaiement: req.body.mode,
                creerPar: req.user,
                client: req.body.client
            }).save()
        console.log(paiement)
        const facture = await Facture.findById(req.body.idFacture)
        if (paiement) {
            // mettre a jour la facture
            if (!facture.montantPayer) {
                facture.montantPayer = 0
            }
            //convertir req.body.monTantPayer en valeur numerique
            facture.montantPayer += Number(req.body.montantPaye)
            facture.resteApayer =Number(req.body.resteApayer)
            facture.paiement.push(paiement._id)
            if (facture.resteApayer === 0) {
                facture.type = "totalite"
            } else {
                facture.type = "enpartie"
            }
            await facture.save().then((doc) => {
                console.log(doc)
            })
        }

      res.status(200).json(facture)
    }catch(error){
        console.log(error)
    }
}
const supprimerFacture= async (req, res, next) => {
    console.log(req.params.id)
    await Facture.deleteOne({_id:req.params.id})
    res.json("success")

}
const voirByIdFacture= async (req, res, next) => {
    console.log(req.params)
}


/* ----------------------- Reçues ---------------------------------*/
const listeRecue= async (req, res, next) => {
    console.log()
    try {
        const liste= await Paiement.find({creerPar:req.user}).sort({'updatedAt': -1}).populate("client facture")
        res.status(200).json(liste)
    } catch (error) {
        res.json({message:error});
    }
}
const voirRecueByid= async (req, res, next) => {
 try {
        console.log("params:",req.params.id)
        const liste= await Paiement.findOne({facture:req.params.id}).populate("client facture")
        console.log("la liste:",liste)
        res.status(200).json(liste)
    } catch (error) {
        res.json({message:error});
    }
}

/* ----------------------- Commission ---------------------------------*/
const listeComission= async (req, res, next) => {
    try {
        const liste= await Commission.find({creerPar:req.user}).sort({'updatedAt': -1}).populate("client recue")
        res.status(200).json(liste)
    } catch (error) {
        res.json({message:error});
    }
}

/* ----------------------- Charge ---------------------------------*/
const creerCharge= async (req, res, next) => {
    console.log(req.user,req.body)
    try {
        const charge = await new Charge(
            {
                observation: req.body.observation,
                periode: periode,
                periodeAjouter: req.body.periodeAjouter,
                type: req.body.type,
                nomCharge: req.body.nomCharge,
                personnel: req.body.personnel,
                montant: req.body.montant,
                creerPar:req.user,
            }
            ).save()
            .then((doc) =>{
                console.log(doc)
                res.json(doc)
            })
        } catch (error) {
            res.json({message:error});
            
        }}
const voirCharge= async (req, res, next) => {
 try {
        const liste= await Charge.findOne({_id:req.params.id})
        console.log("la liste:",liste)
        res.status(200).json(liste)
    } catch (error) {
        res.json({message:error});
    }
}
        const modifierCharge= async (req, res, next) => {
            try{    
                console.log(req.body)
                const update= {
                observation: req.body.observation,
                periode: periode,
                periodeAjouter: req.body.periodeAjouter,
                type: req.body.type,
                nomCharge: req.body.nomCharge,
                personnel: req.body.personnel,
                montant: req.body.montant
               }
           const charge = await Charge.findByIdAndUpdate(req.body._id, update).then(()=>res.json({message:'success'}))
        }catch(error){
        console.log(error)
         }
        }
        const supprimerCharge= async (req, res, next) => {
            try {
                  console.log(req.params.id)
                  await Charge.deleteOne({_id:req.params.id}).then(()=>
                     res.status(200).json("success") )
            } catch (error) {
                res.json({message:error});
            }
        }
        const listeCharge= async (req, res, next) => {
            try {
                const liste= await Charge.find({creerPar:req.user}).sort({'updatedAt': -1})
                res.status(200).json(liste)
            } catch (error) {
                res.json({message:error});
            }
        }
        
        /* ----------------------- Bilan ---------------------------------*/
        
        const genererBilan= async (req, res, next) => {
            try {
                 console.log(req.params)
              const creerPar = req.user;
            const anneeAcademique=req.params.annee 
    // Récupérer toutes les factures de l'utilisateur pour l'année academique donnée
        const factures = await Facture.find({ creerPar, anneeAcademique });
         console.log("factures:",factures)
        // Récupérer toutes les commissions des cours à domicile pour l'année donnée
        const commissions = await cours.find({ creerPar, anneeAcademique});
        console.log("commissions:",commissions)
        // Récupérer toutes les charges pour la période donnée
        const charges = await charge.find({ creerPar, anneeAcademique});
        console.log("charges:",charges)
        // Initialisation des compteurs et montants
        let stats = {
            paye: 0,
            impaye: 0,
            enpartie: 0,
            totalResteApayer: 0,
            totalCommissionCoursDomicile: 0,
            totalCharge:0
        };

        factures.forEach(facture => {
            if (facture.type === "paye" || facture.type === "totalite") {
                stats.paye.montant += facture.montantPayer || 0;
            } else if (facture.type === "impaye") {
                stats.impaye.montant += facture.montant || 0;
            } else if (facture.type === "enpartie") {
                stats.enpartie.montant += facture.montantPayer || 0;
            }
            stats.totalResteApayer += facture.resteApayer || 0;
        });

         console.log("stats1:",stats)
        // Calcul du total des commissions des cours à domicile et charges
        stats.totalCommissionCoursDomicile = commissions.reduce((acc, cur) => acc + (cur.commission || 0), 0);
        stats.totalCharge = charges.reduce((acc, charg) => acc + (charg.montant || 0), 0);
        console.log("stats2:",stats)
        res.status(200).json(stats);
            } catch (error) {
             res.status(500).json({ message: error.message });
            }
}
        const voirTotal= async (req, res, next) => {
            try{
            const arrayParent= await Parent.find({creerPar:req.user})
            const arrayFactureImpaye= await Facture.find({periode:periode,type:'impaye',creerPar:req.user})
            const arrayFacturePaye= await Facture.find({periode:periode,type:'paye',creerPar:req.user})
              const Totalcommission=   arrayParent.reduce((acc,cur)=> acc + cur.commission,0)
               const TotalImpaye=  arrayFactureImpaye.reduce((acc,cur)=> acc + cur.montant,0)
               const Totalpaye=  arrayFacturePaye.reduce((acc,cur)=> acc + cur.montant,0)
               console.log({
                  commissions:Totalcommission,
                  impayes:TotalImpaye,
                  payes:Totalpaye
                 })
                res.status(200).json(
                 {
                  commissions:Totalcommission,
                  impayes:TotalImpaye,
                  payes:Totalpaye
                 }
                )
            }catch(error){
             console.log(error)
            }
}

const cloturer= async (req, res, next) => {
     try{
           const bilan= new Bilan({
            resultat:req.body.resultat ,
            totalCharge:req.body.totalCharge ,
            totalCommission:req.body.totalCommission ,
            factureImpaye:req.body.factureImpaye,
            facturePartielpayer:req.body.facturePartielpayer ,
            factureResteapayer:req.body.factureResteapayer,
            anneeAcademique:req.body.anneeAcademique ,
            creerPar:req.user,
           }).save()
           console.log(bilan)
            res.json(bilan)
        } catch (error) {
            res.json({message:error})
        console.error(error);
    }
}

const bilanByAnnee= async (req, res, next) => {
   try {
       const creerPar = req.user;
       const anneeAcademique=req.body.anneeAcademique 
       const bilan= await Bilan.findOne({creerPar,anneeAcademique})
       console.log(bilan)
       res.json(bilan)
   } catch (error) {
       res.json({message:error});
   }
}

// Statistique des factures : payé, impayé, en partie payé + total reste à payer
const statistiqueFactures = async (req, res, next) => {
    try {
        console.log(req.body)
        const creerPar = req.user;
        const periode = req.body.periode;
       const anneeAcademique=req.body.anneeAcademique 
        // Récupérer toutes les factures de l'utilisateur pour la période donnée
        const factures = await Facture.find({ creerPar, periode });
         console.log("factures:",factures)
        // Récupérer toutes les commissions des cours à domicile pour la période donnée
        const commissions = await cours.find({ creerPar, anneeAcademique});
        console.log("commissions:",commissions)
        // Initialisation des compteurs et montants
        let stats = {
            paye: { count: 0, montant: 0 },
            impaye: { count: 0, montant: 0 },
            enpartie: { count: 0, montant: 0 },
            totalResteApayer: 0,
            totalCommissionCoursDomicile: 0
        };

        factures.forEach(facture => {
            if (facture.type === "paye" || facture.type === "totalite") {
                stats.paye.count += 1;
                stats.paye.montant += facture.montantPayer || 0;
            } else if (facture.type === "impaye") {
                stats.impaye.count += 1;
                stats.impaye.montant += facture.montant || 0;
            } else if (facture.type === "enpartie") {
                stats.enpartie.count += 1;
                stats.enpartie.montant += facture.montantPayer || 0;
            }
            stats.totalResteApayer += facture.resteApayer || 0;
        });
      console.log("stats1:",stats)
        // Calcul du total des commissions des cours à domicile
        stats.totalCommissionCoursDomicile = commissions.reduce((acc, cur) => acc + (cur.commission || 0), 0);
     console.log("stats2:",stats)
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    creerFacture,
    modifierFacture,
    payerFacture,
    payerEncoreFacture,
    supprimerFacture,
    voirByIdFacture,
    listeFacture,
    voirRecueByid,
    voirCharge,
    listeRecue,
    listeComission,
     voirTotal,
    creerCharge,
    modifierCharge,
    supprimerCharge,
    listeCharge,
    genererBilan,
    cloturer,
    getFactureById,
    bilanByAnnee,
    statistiqueFactures
};
