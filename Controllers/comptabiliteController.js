const Facture = require("../models/facture.js");
const Recue = require("../models/recue.js");
const Commission = require("../models/commission.js");
const Bilan = require("../models/bilan.js");
const Charge = require("../models/charge.js");
const moment = require("moment")
const cloudinary = require('cloudinary').v2
cloudinary.config({ 
  cloud_name: 'cfcunadoc', 
  api_key: '121279647952858', 
  api_secret: 'PcZT5j4OaEyZjtUbZsC3iVCksO8' 
});
const periode=`${moment(new Date()).locale('fr').format("MMM")}  ${moment(new Date()).locale('fr').format("YYYY")}`
 
    /* ----------------------- facture ---------------------------------*/
    const creerFacture= async (req, res, next) => {
        try {
            const facture = await new Facture(
                {
                    montant: req.body.montant,
                    periode: periode  ,
                    periodeAjouter:req.body.periodeAjouter ,
                    client: req.body.client,
                    creerPar:req.user,
                    type:"impaye"
      }
      )
      .save()
      .then((doc) =>{
        res.json(doc)}
        );
        const length=await Facture.find({creerPar:req.user,periode:periode}).count() 
         console.log(length)
            if(length===1){
                const bilan= new Bilan({
                    recette:0,
                    charge:0,
                    commission:0,
                    resultat:0,
                    statut:'en cours',
                    periode:periode,
                    creerPar:req.user,
                }).save()
            }

  } catch (error) {
    res.json({message:error});
}
}
const listeFacture= async (req, res, next) => {
    try {
        const liste= await Facture.find({creerPar:req.user}).populate("client")
        res.status(200).json(liste)
    } catch (error) {
        res.json({message:error});
    }
}
const modifieFacture= async (req, res, next) => {
    console.log(req.body)
}
const payerFacture= async (req, res, next) => {
    console.log(req.body)
    try{
         const facture = await Facture.findById(req.body.idFacture)
        facture.type='paye'
        facture.modePaiement=req.body.mode
        facture.refPaiement=req.body.ref
        facture.save().then(async(doc)=>{
            const recue = await new Recue({
                montant:doc.montant,
                facture:doc._id,
                periode:doc.periode,
                periodeAjouter:doc.periodeAjouter,
                modePaiement:doc.modePaiement,
                refPaiement:doc.refPaiement,
                creerPar: req.user,
                client:doc.client
            }).save().then(async(doc)=>{
                const commission = await new Commission({
                    montant:(doc.montant * 10)/100,
                    periode:doc.periode,
                    periodeAjouter:doc.periodeAjouter,
                    creerPar: req.user,
                    client:doc.client,
                    recue:doc._id
                }).save()
            })
        })
        res.status(200).json(facture)
    }catch(error){
        console.log(error)
    }
}
const supprimerFacture= async (req, res, next) => {
    console.log(req.params)
}
const voirByIdFacture= async (req, res, next) => {
    console.log(req.params)
}


/* ----------------------- Reçues ---------------------------------*/
const listeRecue= async (req, res, next) => {
    console.log()
    try {
        const liste= await Recue.find({creerPar:req.user}).populate("client facture")
        res.status(200).json(liste)
    } catch (error) {
        res.json({message:error});
    }
}
const voirByIdRecue= async (req, res, next) => {
    console.log(req)
}

/* ----------------------- Commission ---------------------------------*/
const listeComission= async (req, res, next) => {
    try {
        const liste= await Commission.find({creerPar:req.user}).populate("client recue")
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
        const listeCharge= async (req, res, next) => {
            try {
                const liste= await Charge.find({creerPar:req.user})
                res.status(200).json(liste)
            } catch (error) {
                res.json({message:error});
            }
        }
        
        /* ----------------------- Bilan ---------------------------------*/
        
        const voirByIdBilan= async (req, res, next) => {
            try{
            const arrayComm= await Commission.find({periode:periode,creerPar:req.user})
            const arrayCharge= await Charge.find({periode:periode,creerPar:req.user})
            const arrayRecue= await Recue.find({periode:periode,creerPar:req.user})
                const bilanPeriode= await Bilan.findById(req.params.id)
               bilanPeriode.commission=  await arrayComm.reduce((acc,cur)=> acc + cur.montant,0)
               bilanPeriode.charge= await arrayCharge.reduce((acc,cur)=> acc + cur.montant,0)
               bilanPeriode.recette= await arrayRecue.reduce((acc,cur)=> acc + cur.montant,0)
                 await  bilanPeriode.save().then((doc)=>res.status(200).json(doc))
                   console.log(bilanPeriode)
            }catch(error){
             console.log(error)
            }
}

const cloturerBilan= async (req, res, next) => {
    console.log(req.body)
}
const partager= async (req, res, next) => {
    console.log(req.body)
/*  try {
        // Get details about the asset
     const result = await cloudinary.api.resource(req.body)
        console.log(result);
        return result;
        } catch (error) {
        console.error(error);
    }*/
}

const listeBilan= async (req, res, next) => {
   try {
       const liste= await Bilan.find({creerPar:req.user})
       res.status(200).json(liste)
   } catch (error) {
       res.json({message:error});
   }
}
module.exports = { 
    creerFacture,
    partager,
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
    cloturerBilan,
    listeBilan
};
