const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const path = require("path");
const mongojs = require("mongojs");
require("dotenv").config()

const PORT = process.env.PORT || 1234;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
//mongodb://<dbuser>:<dbpassword>@ds211259.mlab.com:11259/heroku_3zbwvbpc
const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds211259.mlab.com:11259/heroku_3zbwvbpc`
console.log(MONGODB_URI)
//Connect to database.
//"mongodb://localhost/BudgetTrackers"
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// routes
app.use(require("./routes/api.js"));

//Set up Mongo database.
const databaseUrl = process.env.MONGODB_URI || "budget";
const collections = ["budget"];

//Set reference to the database 
const db = mongojs(databaseUrl, collections);

//Throws and error if error occurs 
db.on("error", error => {
  console.log("Database Error:", error);
})


app.listen(PORT, () => {
  console.log(`Application running on PORT ${PORT}`);
});
