const sqlite3 = require('sqlite3')
const { knexMysql } = require('../options/mariaDB');
const { knexSqLite } = require('../options/sqlLite3');

new sqlite3.Database("../DB//ecommerce.sqlite3", (err) => {
    if (err) {
        console.log('Error when creating the database', err)
    } else {
        console.log('Database created!')
        /* Put code to create table(s) here */
        createTable(knexSqLite);
        console.log('tabla creada');
    }
})

const createTable = async (knex) => {
    await knex.schema.createTable('mensajes', table => {
        table.increments('id').primary();
        table.string('author');
        table.string('text');
    });
}

const createTableProductos = async knex => {
    await knex.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('price');
    });
}


createTableProductos(knexMysql)


