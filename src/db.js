const { Client } = require('pg');

//PostgresDB hosted by Microsoft Azure - DB @author: Tyler Cenac
const client = new Client({
    user: 'sboutfhz',
    password: 'gEx-be_nCUUx1WQppSmZeRb8auRFc0Jb',
    host: 'lallah.db.elephantsql.com',
    port: 5432,
    database: 'sboutfhz'
});

module.exports = client;