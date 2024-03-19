const express = require("express");
const appRoute = require("./Routes/mail.js");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API is Working..");
});


// Middleware
app.use("/api", appRoute);



app.listen(port, () => { 
  console.log(`Server started on port: ${port}`); 
});
