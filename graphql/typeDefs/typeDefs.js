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
    id: ID!
    kullanici: Kullanici!
    body: String!
    olusturulmaTarihi: String!
    index: Int!
  }

  type Query {
    getPost: [Post]!
    getComment(commentId: ID!): Comment!
  }

  type Mutation {
    uyeOl(
      kullaniciAd: String!
      email: String!
      parola: String!
      parolaKontrol: String!
    ): String!
    girisYap(kullaniciAd: String!, parola: String!): Kullanici!
    addPost(KullaniciId: ID!, body: String!): String!
    addComment(KullaniciId: ID!, body: String!, postId: ID!): Comment!
  }
`;
