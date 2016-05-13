let restify = require('restify');

let port = process.env.PORT || 3000;
var server = restify.createServer({ name: 'electron-backend', version: '0.0.1' });

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.post('/crashes', (req, res, next) => {
    console.log(req.body);
    res.send(200);
});

server.listen(port, () => {
    console.log('server running on port ' + port);
});