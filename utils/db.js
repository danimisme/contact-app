const dotenv = require("dotenv");
dotenv.config();

const url = process.env.MONGODB_CONNECT_URL;
console.log(url);
const mongoose = require("mongoose");
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
