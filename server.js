const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const bp = require('body-parser')
//const fs = require('fs')
const app = express()
const { knexMysql } = require('./options/mariaDB');
const { knexSqLite } = require('./options/sqlLite3');
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer);
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.static('public'));

class Contenedor {

    constructor(db, table) {

        this.database = db;
        this.table = table;
    }

    async saveProd(obj) {
        console.log(obj.name);
        this.database(this.table).insert({ name: obj.name, price: obj.price })
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
    }

    async saveMessages(obj) {

        this.database(this.table).insert({ author: obj.author, text: obj.text })
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
    }

    async getProd(){
        let prod= this.database(this.table).select('id', 'name', 'price')
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
        return prod;
    }
    
    // async getMessages(){
    //     let mensaje= this.database(this.table).select('author', 'tetxt')
    //     .then((result) => {
    //         console.log(result);
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    //     return mensaje;
    // }
}

const mariaDB = new Contenedor(knexMysql , 'productos');
const sqLite = new Contenedor(knexSqLite , 'mensajes');
let messages = [
];



let productos = [

    {
    
        "name": "inter",
        
        "price": 2000
    },
    {
        
        "name": "defensa y justicia",
        
        "price": 1500

    },
    {
        
        "name": "atletico madrid",
        
        "price": 2500
    }
]
//et productos=[]

/* ----------------------EJS-------------------------------- */

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', { productos })
})


io.on('connection', function (socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages); // emitir todos los mensajes a un cliente nuevo 

    socket.on('new-message', function (data) {
        messages.push(data); // agregar mensajes a array 
        io.sockets.emit('messages', messages); //emitir a todos los clientes
        // console.log(data);
        sqLite.saveMessages(data)
    });


    socket.emit('product', productos); // emitir todos los mensajes a un cliente nuevo 

    socket.on('new-product', function (data) {
        productos.push(data)
        io.sockets.emit('product', productos); //emitir a todos los clientes
        mariaDB.saveProd(data)
    });

});


httpServer.listen(3000, () => console.log('Server ON'))