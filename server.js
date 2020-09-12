const express = require('express');
const server = express();

const apiRouter = require('./routes/apiRouter');
const cors = require('cors');
const helmet = require('helmet');
const fileupload = require('express-fileupload');
const accessControl = require('./middleware/access_control_middleware');

server.use(fileupload({ useTempFiles: true }));
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(accessControl);

server.get('/', (req, res) => {
    res.status(200).json({ message: `hey! you've reached the '/' endpoint.`})
});

// routes all requests to appropriate endpoints
server.use('/api', apiRouter);

module.exports = server;