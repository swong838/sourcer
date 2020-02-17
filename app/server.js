import express from 'express';

import { grab } from './models/sourcer';

const port = process.env.PORT || 5000;
const server = express();


server.use('/', express.static('./app/client'))

server.get('/search/:searchterm(\\w{0,})', (request, response, next) => {
    response.send(grab(searchterm));
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
