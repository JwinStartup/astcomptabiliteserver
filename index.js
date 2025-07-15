//require("dotenv").config();
require("./config.js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes.js");
const cours=require("./routes/cours.js");
const comptabilite = require("./routes/comptabiliteRoutes.js");
//const preinscription = require("./routes/preinscriptionRoutes.js");
const cookieParser=require('cookie-parser')

const port =process.env.PORT || 8080;
const app = express();
app.use(express.json());

// Configuration CORS améliorée
app.use(cors({
  origin: ["https://astcomptabilite.netlify.app","https://astcomptabilite.ci","http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"]
}));

app.use(cookieParser())
app.use(bodyParser.json());

// Middleware CORS supplémentaire pour gérer les cas spéciaux
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://astcomptabilite.ci");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin, X-Requested-With");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});


app.use("/api/users", users.routes);
app.use("/api/comptabilites", comptabilite.routes);
app.use("/api/cours",cours );

app.listen(port, () =>
  console.log(`l'application  a été lancée sur url http://localhost:` + port)
);
