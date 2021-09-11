const { ApolloServer } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const resolvers = require("./graphql/resolvers/resolvers");
const typeDefs = require("./graphql/typeDefs/typeDefs");
const mongoose = require("mongoose");
const { public_DB, local_DB } = require("./Database/config");

require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (ctx) => ctx,
  cors: {
    origin: "*",
    credentials: true,
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: { "editor.theme": "dark" },
      // settings: { "editor.fontFamily": "MesloLGM Nerd Font" },
    }),
  ],
});

mongoose
  .connect(local_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb Bağlanıldı");
    return server.listen({ port: 4000 });
  })
  .then((res) => {
    console.log(`Server ${res.url} adresiinde çalışıyor`);
  });
