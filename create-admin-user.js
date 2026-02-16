const fetch = require('node-fetch');

async function createAdminUser() {
    const baseUrl = 'http://localhost:9000';
    const email = 'admin@harsshdoshi.com';
    const password = 'admin123';

    try {
        console.log('🔐 Creating admin user...');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);

        // Create admin user via the auth endpoint
        const response = await fetch(`${baseUrl}/auth/user/emailpass/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('\n✅ Admin user created successfully!');
            console.log(`\n📧 Login credentials:`);
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);
            console.log(`\n🌐 Admin panel: http://localhost:9000/app`);
        } else {
            const error = await response.text();
            console.error('❌ Failed to create admin user:', error);

            // Try alternative endpoint
            console.log('\n🔄 Trying alternative method...');
            const altResponse = await fetch(`${baseUrl}/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    first_name: 'Admin',
                    last_name: 'User',
                }),
            });

            if (altResponse.ok) {
                console.log('✅ Admin user created via alternative method!');
            } else {
                console.error('❌ Alternative method also failed');
                console.log('\n💡 Manual steps:');
                console.log('   1. Go to: http://localhost:9000/app');
                console.log('   2. Click "Create account" or use the registration form');
                console.log(`   3. Use email: ${email}`);
                console.log(`   4. Use password: ${password}`);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Make sure the Medusa server is running on http://localhost:9000');
        console.log('   Run: npm run dev');
    }
}

createAdminUser();
