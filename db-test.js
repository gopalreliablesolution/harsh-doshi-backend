const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://medusa_user:medusa123@localhost:5432/harsshdoshi_db',
});

console.log('Connecting to database...');
client.connect()
    .then(() => {
        console.log('Connected successfully!');
        return client.query('SELECT 1');
    })
    .then((res) => {
        console.log('Query result:', res.rows[0]);
        return client.end();
    })
    .catch((err) => {
        console.error('Connection error:', err);
        client.end();
    });
