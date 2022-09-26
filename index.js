//Name: Oscar Miralles Fernadez Student ID: 301250756

//Create pluguin functions
var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'product', cmd: 'add' }, function (msg, respond) {
        this.make('product').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'product', cmd: 'get' }, function (msg, respond) {
        this.make('product').load$(msg.data.user_id, respond);
    });

    seneca.add({ role: 'product', cmd: 'get-all' }, function (msg, respond) {
        this.make('product').list$({}, respond);
    });

    seneca.add({ role: 'product', cmd: 'delete' }, function (msg, respond) {
        this.make('product').remove$(msg.data.user_id, respond);
    });


}

module.exports = plugin;

//Create dependencies
var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

//Add service functions
seneca.add('role:api, cmd:add-product', function (args, done) {
    console.log("--> cmd:add-product");
    var product = {
        product: args.product,
        price: args.price,
        category: args.category
    }
    console.log("--> product: " + JSON.stringify(product));
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-products', function (args, done) {
    console.log("--> cmd:get-all-products");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-product', function (args, done) {
    console.log("--> cmd:get-product, args.product_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'get', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-product', function (args, done) {
    console.log("--> cmd:delete-product, args.product_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'delete', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-products', function (args, done) {
    done(null, { cmd: "delete-all-products" });
});

//Call types
seneca.act('role:web', {
    use: {
        prefix: '/myservice',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': { POST: true },
            'get-all-products': { GET: true },
            'get-product': { GET: true, },
            'delete-product': { POST: true, },
            'delete-all-products': { POST: true, }
        }
    }
})

//Create requeriments for the service
var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(seneca.export('web'));

//Create counter function
let getCounter = 0;
let postCounter = 0;

function countGetPost (req, next) {
    if (req.method === "GET") getCounter++;
    if (req.method === "POST") postCounter++;
    console.log("Request counters ---> GET: " + getCounter + " ,POST: " + postCounter);
    if (next) next();
}

//Create service
app.listen(3009)
console.log("Server listening on localhost:3009 ...");

