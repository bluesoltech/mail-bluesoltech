const express = require("express");
const app = express();
const appRoute = require("./routers/route.js");

const PORT = process.env.PORT || 8080;

app.use(express.json());

// routes
app.use("/api", appRoute);

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
