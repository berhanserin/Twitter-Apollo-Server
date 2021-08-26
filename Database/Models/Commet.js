const { model, Schema } = require("mongoose");
var mongoose = require("mongoose");

const commetSchema = new Schema({
  body: { type: String },
  kullanici: { type: mongoose.Schema.Types.ObjectId, ref: "Kullanici" },
  olusturulmaTarihi: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

module.exports = model("Commet", commetSchema);
