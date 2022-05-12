const knexSqLite = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: '../DB//ecommerce.sqlite3'
    },
    useNullAsDefault: true
})

module.exports = { knexSqLite };