const { model, Schema } = require("mongoose");
var mongoose = require("mongoose");
const postSchema = new Schema({
  kullanici: { type: mongoose.Schema.Types.ObjectId, ref: "Kullanici" },
  body: { type: String },
  yorumSayisi: { type: Schema.Types.Number },
  olusturulmaTarihi: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

module.exports = model("Post", postSchema);
