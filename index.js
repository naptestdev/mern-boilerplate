const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv/config");

const PostRoute = require("./routes/PostRoute");

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.json());

app.enable("trust proxy");

mongoose.connect(process.env.MONGODB_URI, {}, () =>
  console.log("Connected to MongoDB Database")
);

app.use("/api/post", PostRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello from MERN stack boilerplate");
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
