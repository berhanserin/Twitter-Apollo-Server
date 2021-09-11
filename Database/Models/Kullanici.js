const { model, Schema } = require("mongoose");

const kullaniciSchema = new Schema({
  kullaniciAd: String,
  parola: String,
  email: String,
  index: Number,
});

module.exports = model("Kullanici", kullaniciSchema);
