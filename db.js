import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 2400,
    user: 'db_dev_studia_js_backend',
    password: 'db_dev_studia_js_backend',
    database: 'db_dev_studia_js_backend'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

export default connection;