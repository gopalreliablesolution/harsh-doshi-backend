import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function createAdminUser({ container }: ExecArgs) {
    const userModuleService = container.resolve(Modules.USER);
    const authModuleService = container.resolve(Modules.AUTH);

    const adminEmail = "harssh@reliablesolution.in";
    const adminPassword = "password";

    console.log("🔐 Creating/Updating admin user...");
    console.log(`   Email: ${adminEmail}`);

    try {
        // Check if user already exists
        const existingUsers = await userModuleService.listUsers({
            email: adminEmail,
        });

        if (existingUsers.length > 0) {
            const existingId = existingUsers[0].id;
            console.log(`ℹ️  User already exists with email: ${adminEmail} (ID: ${existingId})`);
            console.log(`🗑️  Deleting existing user to reset credentials...`);
            await userModuleService.deleteUsers([existingId]);
            console.log(`✅ User deleted`);
        } else {
            console.log(`ℹ️  User does not exist, creating new...`);
        }

        // Create the user (fresh)
        const user = await userModuleService.createUsers({
            email: adminEmail,
            first_name: "Harssh",
            last_name: "Doshi",
        });

        const newUserId = user.id;
        console.log(`✅ User created: ${adminEmail} (ID: ${newUserId})`);

        // Create auth identity for email/password login
        await authModuleService.createAuthIdentities({
            provider_identities: [
                {
                    provider: "emailpass",
                    entity_id: newUserId,
                    provider_metadata: {
                        email: adminEmail,
                        password: adminPassword,
                    },
                },
            ],
        });
        console.log(`✅ Auth identity created`);

        console.log("");
        console.log("✨ Admin user is ready!");
        console.log("");
        console.log("📧 Login credentials:");
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        console.log("");
        console.log("🌐 Admin panel: http://localhost:9000/app/login");
        console.log("");
        console.log("✅ You can now login!");

    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        throw error;
    }
}
