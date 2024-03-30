const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const appRoute = require("./Routes/mail.js");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
};

app.get("/", (req, res) => {
  res.send("API is Working..");
});

// Middleware
app.use(express.json({ limit: "2000mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/api", appRoute);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
