import express from 'express';

import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './lib/gql';

import { PostAPI, queue } from './lib/sourcer';


// gql
const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        postAPI: new PostAPI(),
    })
});


// frontend
const port = process.env.PORT || 5000;
const webServer = express();

// init json parsing middleware
webServer.use(express.json())

// the app
webServer.use('/', express.static('./app/client'))



// proxy the remote API call through this webServer
webServer.get('/search/:searchterm([a-zA-Z0-9-_]{0,})', async (request, response, next) => {

    // const results = await grab(request.params.searchterm);

    // response.json(results);


});

// proxy the client calls to the local processing API
webServer.post('/push', async (request, response, next) => {
    const results = await queue(request.body.identifier);
    response.json(results);
});


// start the app
gqlServer.listen().then(({ url }) => {
    console.log(`gql endpoint up at port ${url}`)
});

webServer.listen(port, () => {
    console.log(`Frontend listening on port ${port}`);
});
