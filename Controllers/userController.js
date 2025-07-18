const Commission = require("../models/commission.js");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Parent = require("../models/parent.js");
const Personnel = require("../models/personnel.js");
const Enfant = require("../models/enfant.js");


const inscriptionParent= async (req, res, next) => {
  try {
    const parent = await new Parent(
      {
        nom: req.body.nom,
        prenoms: req.body.prenoms,
        cel: req.body.cel,
        email: req.body.email,
        whatshapp: req.body.whatshapp,
        ville: req.body.ville,
        genre: req.body.genre,
        commune: req.body.commune,
        nombreEnfant: req.body.nombreEnfant,
        montantCours:req.body.montantCours,
        quartier: req.body.quartier,
        commission:req.body.commission,
        creerPar:req.user
      }
    )
      .save()
      .then(async (doc) =>
          await new Commission({
                    montant:req.body.montantCours,
                    commission:req.body.commission,
                    creerPar: req.user,
                    client:doc._id,
                }).save().then(()=>res.json(doc)))
      } catch (error) {
        res.json({message:error});
  }
}
const inscriptionEnfant= async (req, res, next) => {
  try {
    console.log(req.body)
    const enfant = await new Enfant(
      {
        nom: req.body.nom,
        prenoms: req.body.prenoms,
        cel: req.body.cel,
        ville: req.body.ville,
        commune: req.body.commune,
         genre: req.body.genre,
        classe: req.body.classe,
        formateur: req.body.formateur,
        parent: req.body.parent,
        creerPar:req.user
      }
    )
      .save()
      .then((doc) =>
        res.json(doc)
      );
  } catch (error) {
    res.json({message:error});
  }
}
const inscriptionPersonnel= async (req, res, next) => {

  try {
    const personnel = await new Personnel(
      {
        nom: req.body.nom,
        prenoms: req.body.prenoms,
        cel: req.body.cel,
        email: req.body.email,
        whatshapp: req.body.whatshapp,
        ville: req.body.ville,
         genre: req.body.genre,
        commune: req.body.commune,
        discipline: req.body.discipline,
        creerPar:req.user
      }
    )
      .save()
      .then((doc) =>
        res.json(doc)
      );
  } catch (error) {
    res.json({message:error});
  }
}
const listeParent= async (req, res, next) => {
  try{
  const liste= await Parent.find({creerPar:req.user})
     .populate({
          path: "cours",
          populate: { path: "eleve" }
      }).sort({'updatedAt': -1})
  res.json(liste)
  }catch(error){
     res.json({message:error});

  }
}
const listeEnfant= async (req, res, next) => {
  try{
  const liste= await Enfant.find({creerPar:req.user}).sort({'updatedAt': -1}).populate('formateur parent')
  res.status(200).json(liste)
  }catch(error){
     res.json({message:error});

  }
}
const listePersonnel= async (req, res, next) => {
  try{
    const liste= await Personnel.find({creerPar:req.user}).sort({'updatedAt': -1})
    res.status(200).json(liste)
    }catch(error){
       res.json({message:error});
    }
  
}

const inscription = async (req, res, next) => {
  console.log(req.body)
  try {
    const userExist = await User.findOne({ nom: req.body.nom });
    if (userExist) {
      res.status(500).send({
        error: "Ce nom a deja étè utilisé, Veuillez utiliser un autre",
      });
    } else {
      const hashedpassword = await bcrypt.hash(req.body.password, 12);

      const user = await new User({
        nom: req.body.nom,
        email: req.body.email,
        zone:req.body.zone,
        role:req.body.role,
        cel:req.body.cel,
        password: hashedpassword,
      })
        .save()
        .then((doc) =>
          res.json({message:"success"})
        );
    }
  } catch (error) {
     res.json({message:error});
  }
};

const lister = async (req, res, next) => {
  try {
    const liste = await User.find();
    res.json(liste);
  } catch (error) {
    res.json(error);
  }
};

const connexion = async (req, res, next) => {
  try {
    const maxAge= 24*60*60
    const user = await User.findOne({ nom: req.body.nom });
    if (!user) {
      res.status(400).json({message:"nom existe déja"});
    }

    const estEgal = await bcrypt.compare(req.body.password, user.password);
    if (!estEgal) {
      res.status(400).json({message:"Mot de passe incorrect"});
    }
    const token = jwt.sign(
      { userID: user.id, email: user.email },
      "ast comptabilite zo",
      {
        expiresIn: "1d",
      }
    );
    res.cookie('jwt', token,{sameSite:"none",secure:"true",maxAge:new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1))})
    res.status(200).json({
      user:{
        nom: user.nom,
        email: user.email,
        role:user.role,
        cel:user.cel,
           }
    })
  } catch (error) {
    new Error(error)
  }
};

const modifier = async (req, res, next) => {
  try {
    const moi = await User.findByIdAndUpdate(req.body._id,{
        role:req.body.role,
        zone:req.body.zone,
        cel:req.body.cel});
    res.json(moi);
  } catch (error) {
    new Error(error)
  }
};
const modifierEnfant = async (req, res, next) => {
  try {
    const moi = await Enfant.findByIdAndUpdate(req.body._id,{
        nom: req.body.nom,
        prenoms: req.body.prenoms,
        cel: req.body.cel,
        ville: req.body.ville,
        commune: req.body.commune,
         genre: req.body.genre,
        classe: req.body.classe,
        formateur: req.body.formateur,
        parent: req.body.parent,
    });
          console.log(moi)
        res.json(moi)
      
  } catch (error) {
    new Error(error)
  }
};
const modifierParent = async (req, res, next) => {
  try {
    console.log(req.body)
    const moi = await Parent.findByIdAndUpdate(req.body._id,{
         nom: req.body.nom,
        prenoms: req.body.prenoms,
        cel: req.body.cel,
        email: req.body.email,
        whatshapp: req.body.whatshapp,
        ville: req.body.ville,
        genre: req.body.genre,
        commune: req.body.commune,
        nombreEnfant: req.body.nombreEnfant,
        montantCours:req.body.montantCours,
        quartier: req.body.quartier,
        commission:req.body.commission,
    });
      console.log(moi)
        res.json(moi)
      
  } catch (error) {
    new Error(error)
  }
};
const modifierPersonnel = async (req, res, next) => {
  try {
    const moi = await Personnel.findByIdAndUpdate(req.body._id,{
       nom: req.body.nom,
        prenoms: req.body.prenoms,
        cel: req.body.cel,
        email: req.body.email,
        whatshapp: req.body.whatshapp,
        ville: req.body.ville,
         genre: req.body.genre,
        commune: req.body.commune,
        discipline: req.body.discipline,
    });
        console.log(moi)
        res.json(moi)
  } catch (error) {
    new Error(error)
  }
};
const supprimer = async (req, res, next) => {
  try {
    console.log(req.params.id)
    const moi = await User.findByIdAndDelete(req.params.id)
        res.json('success')
      
    
  } catch (error) {
    new Error(error)
  }
};
const voir = async (req, res, next) => {
  try {
    const moi = await User.findById(req.params.id);
        res.json(moi)
  } catch (error) {
    new Error(error)
  }
};
const voirParent = async (req, res, next) => {
  try {
    const moi = await Parent.findById(req.params.id);
        res.json(moi)
  } catch (error) {
    new Error(error)
  }
};
const voirPersonnel = async (req, res, next) => {
  try {
    const moi = await Personnel.findById(req.params.id);
        res.json(moi)
  } catch (error) {
    new Error(error)
  }
};
const voirEnfant = async (req, res, next) => {
  try {
    const moi = await Enfant.findById(req.params.id);
        res.json(moi)
  } catch (error) {
    new Error(error)
  }
};
const supprimerParent = async (req, res, next) => {
  try {
    const moi = await Parent.findByIdAndDelete(req.params.id)
    res.json("success")
  } catch (error) {
    new Error(error)
  }
};
const supprimerEnfant = async (req, res, next) => {
  try {
    console.log(req.params.id)
     await Enfant.findByIdAndDelete(req.params.id)
    res.json("success")
   // const moi = await Enfant.findByIdAndDelete(req.params.id).save()
    //  .then((doc) =>
    //    res.json(doc)
    //  );
      
  } catch (error) {
    new Error(error)
  }
};
const supprimerPersonnel = async (req, res, next) => {
  try {
    console.log('le id du personnel a supprimé:',req.params.id)
    const moi = await Personnel.findByIdAndDelete(req.params.id)
    res.json("success")
  } catch (error) {
    new Error(error)
  }
};
const changerMotPasse = async (req, res, next) => {
  try {
    console.log('Changement de mot de passe pour:', req.body);
    
    // Vérifier que tous les champs requis sont présents
    if (!req.body.ancienMotPasse || !req.body.nouveauMotPasse || !req.body.userId) {
      return res.status(400).json({
        message: "Tous les champs sont requis: ancienMotPasse, nouveauMotPasse, userId"
      });
    }

    // Trouver l'utilisateur
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

  
    // Hasher le nouveau mot de passe
    const hashedNouveauMotPasse = await bcrypt.hash(req.body.nouveauMotPasse, 12);

    // Mettre à jour le mot de passe dans la base de données
    await User.findByIdAndUpdate(req.body.userId, {
      password: hashedNouveauMotPasse
    });

    console.log('Mot de passe changé avec succès pour l\'utilisateur:', user.nom);
    
    res.status(200).json({
      message: "Mot de passe changé avec succès"
    });

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      message: error.message || "Erreur lors du changement de mot de passe"
    });
  }
};
const deconnexion = async (req, res, next) => {
  try {
    res.cookie('jwt','',{maxAge:1,sameSite: "none",secure: "true"});
    res.json({message:"logout"})
  } catch (error) {
    new Error(error)
  }
};


module.exports = { 
  inscription,
  listeEnfant,
  inscriptionEnfant,
  modifierPersonnel,
  modifierParent,
  modifierEnfant,
  connexion ,
  deconnexion,
  lister ,
  voir,
  modifier,
  voirParent,
  voirEnfant,
  voirPersonnel,
  supprimer,
  supprimerPersonnel,
  supprimerParent,
  supprimerEnfant,
  inscriptionParent,
  inscriptionPersonnel,
  listeParent,
  listePersonnel,
  changerMotPasse
};
