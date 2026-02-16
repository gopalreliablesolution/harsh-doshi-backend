const { Client } = require('pg');

const dbName = process.argv[2] || 'harsshdoshi_db';
const connectionString = `postgres://medusa_user:medusa123@127.0.0.1:5432/${dbName}`;

console.log(`Attempting to connect to: ${dbName} via 127.0.0.1...`);

const client = new Client({
    connectionString: connectionString,
});

client.connect()
    .then(() => {
        console.log(`✅ Success! Connected to ${dbName}`);
        return client.query('SELECT 1');
    })
    .then(() => {
        console.log('✅ Query executed successfully.');
        return client.end();
    })
    .catch((err) => {
        console.error(`❌ Connection failed to ${dbName}:`, err.message);
        client.end();
    });
