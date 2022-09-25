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

var seneca = require("seneca")();
seneca.use(pluguin);
seneca.use('seneca-entity');


//Create dependencies for the service
var express = require('express');
var app = express();
var web = require('seneca-web');

app.use(require(body-parser).json())
app.use(seneca.export('web'));

//listen port
app.listen(3009)
console.log("Server listening on http://127.0.0.1:3009");

