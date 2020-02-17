import express from 'express';
const port = process.env.PORT || 5000;
const server = express();


console.log('[][][] starting express')

server.use('/', express.static('./app/client'))

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
