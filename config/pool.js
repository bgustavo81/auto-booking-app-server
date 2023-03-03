const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DbUser,
    host: process.env.DbHost,
    database: process.env.DbDatabase,
    password: process.env.DbPassword,
    port: 5432,
    ssl: true
});

pool.connect()
    .then(() => console.log("Connected Successfully!"))
    .then((e) => console.log());


module.exports = pool;