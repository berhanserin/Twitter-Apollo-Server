const { gql } = require("apollo-server");

module.exports = gql`
  type Kullanici {
    id: ID!
    kullaniciAd: String!
    email: String!
    token: String!
    index: Int!
  }

  type Comment {
    kullanici: Kullanici!
    post: Post!
    body: String!
    olusturulmaTarihi: String!
  }

  type Post {
    kullanici: Kullanici!
    comment: Comment!
    body: String!
    olusturulmaTarihi: String!
    yorumSayisi: Int!
    begeniSayisi: Int!
  }

  type Query {
    getPost: [Post]!
    girisYap(kullaniciAd: String!, parola: String!): Kullanici!
    getComment(commentId: ID!): Comment!
  }

  type Mutation {
    uyeOl(
      kullaniciAd: String!
      email: String!
      parola: String!
      parolaKontrol: String!
    ): String!
    addPost(KullaniciId: ID!, body: String!): Post!
    addComment(KullaniciId: ID!, body: String!, postId: ID!): Comment!
  }
`;
