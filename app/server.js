import express from 'express';

import { grab, queue } from './models/sourcer';

const port = process.env.PORT || 5000;
const server = express();

server.use(express.json())
server.use('/', express.static('./app/client'))

server.get('/search/:searchterm([a-zA-Z0-9-_]{0,})', async (request, response, next) => {
    const results = await grab(request.params.searchterm);
    response.json(results);
});

server.post('/push', async (request, response, next) => {
    const results = await queue(request.body.identifier);
    response.json(results);
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
