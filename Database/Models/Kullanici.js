const { model, Schema } = require("mongoose");

const kullaniciSchema = new Schema({
  kullaniciAd: String,
  parola: String,
  email: String,
});

module.exports = model("Kullanici", kullaniciSchema);
