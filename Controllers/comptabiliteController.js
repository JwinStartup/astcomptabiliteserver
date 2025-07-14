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
                periode: req.body.periode,
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
                periode: req.body.periode,
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
        
        const  genererBilan= async (req, res, next) => {
            try {
                 console.log('les parametre genererBilan',req.params)
              const creerPar = req.user;
            const annee = req.params.annee;
            
            // Calculer les dates de début et fin pour l'année de création
            const debutAnnee = new Date(`${annee}-01-01`);
            const finAnnee = new Date(`${annee}-12-31T23:59:59.999Z`);
            
    // Récupérer toutes les factures de l'utilisateur pour l'année de création donnée
        const factures = await Facture.find({ 
            creerPar, 
            createdAt: { $gte: debutAnnee, $lte: finAnnee }
        });
         console.log("factures:",factures)
        // Récupérer toutes les commissions des cours à domicile pour l'année donnée
        const commissions = await cours.find({ 
            creerPar, 
            createdAt: { $gte: debutAnnee, $lte: finAnnee }
        });
        console.log("commissions:",commissions)
        // Récupérer toutes les charges pour l'année de création donnée
        const charges = await charge.find({ 
            creerPar, 
            createdAt: { $gte: debutAnnee, $lte: finAnnee }
        });
        console.log("charges:",charges)
        
        // Initialisation des compteurs et montants
        let stats = {
            facturesPaye: 0,
            facturesImpaye: 0,
            facturesEnpartie: 0,
            totalResteApayer: 0,
            totalCommissionCoursDomicile: 0,
            totalCharge: 0,
            totalRecettes: 0,
            beneficeNet: 0,
            annee: annee
        };

        // Traitement des factures
        factures.forEach(facture => {
            if (facture.type === "paye" || facture.type === "totalite") {
                stats.facturesPaye += facture.montantPayer || 0;
            } else if (facture.type === "impaye") {
                stats.facturesImpaye += facture.montant || 0;
            } else if (facture.type === "enpartie") {
                stats.facturesEnpartie += facture.montantPayer || 0;
            }
            stats.totalResteApayer += facture.resteApayer || 0;
        });

         console.log("stats après traitement factures:",stats)
        
        // Calcul du total des commissions des cours à domicile
        stats.totalCommissionCoursDomicile = commissions.reduce((acc, cur) => acc + (cur.commission || 0), 0);
        
        // Calcul du total des charges
        stats.totalCharge = charges.reduce((acc, charg) => acc + (charg.montant || 0), 0);
        
        // Calcul des totaux
        stats.totalRecettes = stats.facturesPaye + stats.facturesEnpartie + stats.totalCommissionCoursDomicile;
        stats.beneficeNet = stats.totalRecettes - stats.totalCharge;
        
        console.log("stats finales:",stats)
        res.status(200).json(stats);
            } catch (error) {
             console.log("Erreur dans genererBilan:", error);
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
        console.log('Données reçues pour clôturer:', req.body)
        
        // Créer un nouveau bilan avec toutes les données de req.body
        const bilan = new Bilan({
            // Nouveaux champs principaux
            facturesPaye: req.body.facturesPaye || 0,
            facturesImpaye: req.body.facturesImpaye || 0,
            facturesEnpartie: req.body.facturesEnpartie || 0,
            totalResteApayer: req.body.totalResteApayer || 0,
            totalCommissionCoursDomicile: req.body.totalCommissionCoursDomicile || 0,
            totalCharge: req.body.totalCharge || 0,
            totalRecettes: req.body.totalRecettes || 0,
            beneficeNet: req.body.beneficeNet || 0,
            annee: req.body.annee || req.body.anneeAcademique,
            
                       // Utilisateur qui crée le bilan
            creerPar: req.user,
        });

        const bilanSauvegarde = await bilan.save();
        console.log('Bilan créé avec succès:', bilanSauvegarde)
        res.status(201).json(bilanSauvegarde)
        
    } catch (error) {
        console.error('Erreur lors de la création du bilan:', error);
        res.status(500).json({message: error.message || error})
    }
}

const bilanById= async (req, res, next) => {
   try {
       const bilan= await Bilan.findById(req.params.id)
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
      
        // Si le bilan existe déjà, on le retourne true à la variable bilanCloture
           
        // Calculer les dates de début et fin pour l'année académique
        const debutAnnee = new Date(`${anneeAcademique}-01-01`);
        const finAnnee = new Date(`${anneeAcademique}-12-31T23:59:59.999Z`);
        
        // Récupérer toutes les factures de l'utilisateur pour la période donnée
        const factures = await Facture.find({ creerPar, periode });
        // Récupérer toutes les commissions des cours à domicile pour l'année donnée
        const commissions = await cours.find({ 
            creerPar, 
            createdAt: { $gte: debutAnnee, $lte: finAnnee }
        });
        const charges = await charge.find({
            periode, 
            creerPar, 
        });
        // Initialisation des compteurs et montants
        let stats = {
            paye: { count: 0, montant: 0 },
            impaye: { count: 0, montant: 0 },
            enpartie: { count: 0, montant: 0 },
            totalResteApayer: 0,
            totalCommissionCoursDomicile: 0,
            totalCharge:0,
            bilanCloture: null, 
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
        //verifie si le bilan de l'année académique existe déjà
        // Si le bilan existe déjà, on le retourne true à la variable bilanCloture qui sera dans les statistiques initialisé à false
        const bilanCloture = await Bilan.findOne({ 
            creerPar,
            //on utilisera annee egale req.body.anneeAcademique 
            annee: req.body.anneeAcademique,
        });
         console.log("Bilan existant trouvé:", bilanCloture) 
        if (bilanCloture) {
            stats.bilanCloture = bilanCloture?._id;
        }
             // Si le bilan existe, on met à jour la variable bilanCloture
        // Calcul du total des commissions des cours à domicile
        stats.totalCommissionCoursDomicile = commissions.reduce((acc, cur) => acc + (cur.commission || 0), 0);
        stats.totalCharge = charges.reduce((acc, charg) => acc + (charg.montant || 0), 0);
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
    bilanById,
    statistiqueFactures
};
