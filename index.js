//Create pluguin functions
var pluguin = function (options) {
    var seneca = this;

    seneca.add({ role: 'product', cmd: 'post'}, function (msg, respond) {
        this.make('product').data$(msg.data).save$(respond);
    });
    
    seneca.add({ role: 'product', cmd: 'get'}, function (msg, respond) {
        this.make('product').load$(msg.data.item_id,respond);
    });

    seneca.add({ role: 'product', cmd: 'get-all'}, function (msg, respond) {
        this.make('product').list$({},respond);
    });

    seneca.add({ role: 'product', cmd: 'delete'}, function (msg, respond) {
        this.make('product').remove$(msg.data.item_id, respond);
    });
}

//Create dependencies
module.exports = pluguin;


//Create api functionalities to call
seneca.act({
    use: {
        prefix: '/mysenecaservice',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': {POST: true},
            'get-all-products': { GET: true },
            'get-product': { GET: true },
            'delete-product': { GET: true }
        }
    }
})

//Create counter function
let getCounter = 0;
let postCounter = 0;

function countGetPost (req, next) {
    if (req.method === "GET") getCounter++;
    if (req.method === "POST") postCounter++;
    console.log("Request counters ---> Get: " + getCounter + " ,POST: " + postCounter);
    if (next) next();
}

//Create dependencies for the service
var express = require('express');
var app = express();
var web = require('seneca-web');

app.use(require(body-parser).json())
app.use(seneca.export('web'));

//listen port
app.listen(3009)
console.log("Server listening on http://127.0.0.1:3009");

