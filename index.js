const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
  }
};

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

connectToDatabase();

app.use(express.json({ extended: false }));

// routes
app.use("/api/auth", require("./server/routes/api/auth"));
app.use("/api/users", require("./server/routes/api/users"));
app.use("/api/lists", require("./server/routes/api/lists"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
