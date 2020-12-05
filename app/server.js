import express from 'express';

import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './lib/gql';
import { PostAPI, GrabberAPI } from './lib/sourcer';


// frontend
const port = process.env.PORT || 5000;
const webServer = express();

// gql
const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        postAPI: new PostAPI(),
        grabberAPI: new GrabberAPI(),
    })
});

// init json parsing middleware
webServer.use(express.json())

// the app
webServer.use('/', express.static('./app/client'))

// start the app
gqlServer.listen().then(({ url }) => console.log(`gql endpoint up at port ${url}`);
webServer.listen(port, () => console.log(`Frontend listening on port ${port}`);
