const express = require("express");
const appRoute = require("./Routes/mail.js");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

dotenv.config({ path: "./.env" });

const corsOptions = {
  origin: true,
  limit: "2048mb",
};

const app = express();
const port = process.env.PORT || 8000;
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("API is Working..");
});

// Multer file transfer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + getFileExtension(file.originalname)
    );
  },
});

const getFileExtension = (filename) => {
  return filename.substring(filename.lastIndexOf("."));
};

// Initialize Multer with the defined storage
const upload = multer({ storage: storage });

app.post("/upload", upload.single("document"), (req, res) => {
  // File is available in req.file
  console.log(req.body);
  res.send({ message: "File uploaded successfully", file: req.body });
});

// Middleware
app.use(bodyParser.json({ limit: "2048mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "2048mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use("/api", appRoute);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
