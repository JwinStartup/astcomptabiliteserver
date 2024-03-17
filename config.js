const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://astcomptabilite:wgfGuDkYjmHWR0jf@cluster0.kpvleth.mongodb.net/ASTCOMPTABILITE", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connecté"))
  .catch((err) => console.log(err));