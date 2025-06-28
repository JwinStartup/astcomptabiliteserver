const Facture = require("../models/facture.js");
const Paiement = require("../models/paiement.js");
const Commission = require("../models/commission.js");
const Parent = require("../models/parent.js");
const Bilan = require("../models/bilan.js");
const Charge = require("../models/charge.js");
const moment = require("moment")
const axios = require("axios")
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
         //creer un nouveau recue et enregistre le montant payer et le mode de paiement

         const paiement = await new Paiement({
                montant: req.body.montantPayer,
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
            facture.montantPayer += req.body.montantPayer
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
        const paiement = await new Paiement({
                montant: req.body.montantPayer,
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
            facture.montantPayer += Number(req.body.montantPayer)
            facture.resteApayer =Number(facture.montantPayer) - Number(req.body.montantPayer)
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
        
        const voirByIdBilan= async (req, res, next) => {
            try{
            const arrayComm= await Commission.find({periode:periode,creerPar:req.user})
            const arrayCharge= await Charge.find({periode:periode,creerPar:req.user})
            const arrayRecue= await Paiement.find({periode:periode,creerPar:req.user})
                const bilanPeriode= await Bilan.findById(req.params.id)
              if ( bilanPeriode.statut!=='cloturé') {
               bilanPeriode.charge= await arrayCharge.reduce((acc,cur)=> acc + cur.montant,0)
               bilanPeriode.recette= await arrayRecue.reduce((acc,cur)=> acc + cur.montant,0)
                 await  bilanPeriode.save().then((doc)=>res.status(200).json(doc))
              } else {
                  res.status(200).json(bilanPeriode)
              }
            }catch(error){
             console.log(error)
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
   const bilanPeriode= await Bilan.findById(req.body.id)
   bilanPeriode.resultat=req.body.resultat
   bilanPeriode.statut='cloturé'
   await  bilanPeriode.save().then((doc)=>res.status(200).json(doc))
            }catch(error){
             console.log(error)
            }
}
const partager= async (req, res, next) => {
    console.log(req.body.url)
      try {
    let url = "https://graph.facebook.com/v18.0/250250498176635/messages";

let payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": "+2250500908420",
      "type": "document",
      "document": { // the text object
        "link": `${req.body.url}`,
        "filename":`${req.body.filename}`
        }
        };

let  headers = {
                'Authorization': 'Bearer EAAENJVQnPZCsBO9Ezn4FPwy5p6gJWU4h2qZCNtpk4I1V6faNd5IPsn7PqrFloO0mhT9dvaCDU9s7KlGoD93UE7lSwQWhVuZB7O6qT6Fy3PCI8MqR5hbhitNKSZCZAAXcIrZCh5VZCHdorMKZCcDoObgg7M1WwZBZBiZCclTLXAs0qHlSxJTlpZA75IGr57GGwolB4nBtR4AtnAtZBQQUzOaiqWUYZD',
                'Content-Type': 'application/json'
               };

  axios.post(url, payload, {
    headers: headers
  })
  .then(function (response) {
    res.status(200).json({message:'succes'})
  })
        } catch (error) {
        console.error(error);
    }
}

const listeBilan= async (req, res, next) => {
   try {
       const liste= await Bilan.find({creerPar:req.user}).sort({'updatedAt': -1})
       res.status(200).json(liste)
   } catch (error) {
       res.json({message:error});
   }
}
module.exports = { 
    creerFacture,
    partager,
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
    voirByIdBilan,
    cloturer,
    listeBilan
};
