import express from 'express';

import { ApolloServer, gql } from 'apollo-server';
import { typeDefs, resolvers } from './lib/gql';

import { grab, queue } from './lib/sourcer';

const port = process.env.PORT || 5000;
const server = express();

// init json parsing middleware
server.use(express.json())

// the app
server.use('/', express.static('./app/client'))

// proxy the remote API call through this server
server.get('/search/:searchterm([a-zA-Z0-9-_]{0,})', async (request, response, next) => {
    const results = await grab(request.params.searchterm);
    response.json(results);
});

// proxy the client calls to the local processing API
server.post('/push', async (request, response, next) => {
    const results = await queue(request.body.identifier);
    response.json(results);
});

// start the app
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
