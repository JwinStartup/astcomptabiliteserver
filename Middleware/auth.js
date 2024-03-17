const User = require("../models/user.js");
const jwt =require('jsonwebtoken');

module.exports= function(req,res,next){
    const token = req.cookies.jwt
    if(!token){return res.status(401).json("pas de token")}
    
    try {
        const decoded=  jwt.verify(token,'ast comptabilite zo')
        req.user=decoded.userID
        next()
    } catch (error) {
        
     res.status(401).json("token invalide")
    }

};