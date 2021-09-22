const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const Kullanici = require("../../Database/Models/Kullanici");
const Post = require("../../Database/Models/Post");
const Commet = require("../../Database/Models/Commet");

const { JWT_Key } = require("../../Database/config");
module.exports = {
  Query: {
    getPost: async () => {
      try {
        const allpost = Post.find({}).populate("kullanici");
        return allpost;
      } catch (error) {
        throw new Error(error);
      }
    },
    getComment: async (parent, args) => {
      console.log("sadasd");
      const { commentId } = args;
      return Commet.findById(commentId).populate("kullanici").populate("post");
    },
  },
  Mutation: {
    girisYap: async (parent, args) => {
      const { kullaniciAd, parola } = args;
      let hatalar = {};
      try {
        if (kullaniciAd.trim() === "")
          hatalar.kullaniciAd = "Kullanıcı adı boş geçilemez.";
        if (parola.trim() === "") hatalar.parola = "Parola boş geçilemez.";
        let kullanici = await Kullanici.findOne({ kullaniciAd: kullaniciAd });

        if (!kullanici) {
          kullanici = await Kullanici.findOne({ email: kullaniciAd });
        }
        if (!kullanici) {
          hatalar.kullanici = "Kullanıcı bulunamadı.";
          throw new UserInputError("Kullanıcı Bulunamadı", { hatalar });
        }

        if (Object.keys(hatalar).length > 0) {
          throw new UserInputError("Kullanıcı Hatası", { hatalar });
        }

        const eslesmişParola = bcryptjs.compareSync(parola, kullanici.parola);

        if (!eslesmişParola) {
          hatalar.parola = "Parola doğru değil";
          throw new AuthenticationError("Parola doğru değil", { hatalar });
        }

        const { id } = kullanici;
        const token = jwt.sign({ kullaniciAd, id }, JWT_Key, {
          expiresIn: 600 * 600,
        });
        kullanici.token = token;
        return kullanici;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    uyeOl: async (parent, args) => {
      let hatalar = {};
      let { kullaniciAd, email, parola, parolaKontrol } = args;
      try {
        if (email.trim() === "") hatalar.email = "Email boş geçilemez.";
        if (kullaniciAd.trim() === "")
          hatalar.email = "Kullanıcı Ad boş geçilemez.";
        if (parola.trim() === "") hatalar.email = "Parola boş geçilemez.";
        if (parolaKontrol.trim() === "")
          hatalar.email = "Parola kontrol boş geçilemez.";

        const dbKullaniciAd = await Kullanici.findOne({
          kullaniciAd: kullaniciAd,
        });
        const dbEmail = await Kullanici.findOne({
          email: email,
        });

        if (dbKullaniciAd)
          hatalar.kullaniciAD = "Bu kullanıcı ad daha önce kullanılmış.";

        if (dbEmail) hatalar.email = "Bu email daha önce kullanılmış.";

        if (parola != parolaKontrol)
          hatalar.parolaKontrol = "Parola ile parola tekrarı uyuşmuyor.";

        if (Object.keys(hatalar).length > 0) {
          throw hatalar;
        }
        parola = await bcryptjs.hash(parola, 3);
        let index = await Kullanici.estimatedDocumentCount().then((i) => {
          return i;
        });

        Kullanici.create({
          kullaniciAd,
          email,
          parola,
          index,
        });
        return "Kayıt Başarılı";
      } catch (error) {
        throw new UserInputError("Hatalı Erişim", { hatalar: error });
      }
    },
    addPost: async (parent, args) => {
      try {
        const { KullaniciId, body } = args;
        console.log(args);
        Post.create({
          kullanici: KullaniciId,
          body: body,
          yorumSayisi: 0,
        });
        return "Post Paylaşıldı";
      } catch (error) {
        console.log(error);
      }
    },
    addComment: async (parent, args) => {
      try {
        const { postId, KullaniciId, body } = args;

        const post = Post.findById(postId, (err, data) => {
          if (err) {
            throw new UserInputError("Böyle bir kullanıcı yok.", { err });
          }

          data.yorumSayisi = ++data.yorumSayisi;

          data.save((err) => {
            if (err) {
              throw new UserInputError("Güncelleme Yapılamadı.", { err });
            }
          });
        });

        return Commet.create({
          body: body,
          kullanici: KullaniciId,
          post: postId,
        });
      } catch (error) {
        console.log(error);
      }
    },
    updatePost: async (parent, args) => {
      try {
        const { postId, body } = args;
        console.log(args);

        const post = Post.findById(postId, (err, data) => {
          if (err) {
            throw new UserInputError("Böyle bir kullanıcı yok.", { err });
          }
          data.body = body;
          data.save((err) => {
            if (err) {
              throw new UserInputError("Güncelleme Yapılamadı.", { err });
            }
          });
        });

        return "Updated";
      } catch (error) {
        console.log(error);
      }
    },
  },
};
