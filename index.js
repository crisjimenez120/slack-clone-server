import models from './models'
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const PORT = 4000;

const app = express();


//const graphqlEndpoint = '/graphql';

// app.use(
//   graphqlEndpoint,
//   bodyParser.json(),
//   graphqlExpress({
//     schema,
//     context: {
//       models,
//       user: {
//         id: 1,
//       },
//     },
//   }),
// );


const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

models.sequelize.sync().then(() =>{
	app.listen(PORT);
});


