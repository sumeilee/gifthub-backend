require("dotenv").config({ path: "../../.env" });

const mongoose = require("mongoose");

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
mongoose.set("useFindAndModify", false);

const seedModel = process.argv[2];
const seedFile = process.argv[3];

const seedData = require(`./${seedFile}`);
const model = require(`../../models/${seedModel}Model`);

// console.log(mongoURI);
// console.log(seedData);
// console.log(model);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connection successful");

    model
      .insertMany(seedData)
      .then(() => {
        console.log("Data seeding of items successful");
      })
      .catch((insertErr) => {
        console.log(insertErr);
      })
      .finally(() => {
        mongoose.disconnect();
      });
  })
  .catch((err) => {
    console.log(err);
  });
