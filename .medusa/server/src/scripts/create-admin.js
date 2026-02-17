"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createAdminUser;
const utils_1 = require("@medusajs/framework/utils");
async function createAdminUser({ container }) {
    const userModuleService = container.resolve(utils_1.Modules.USER);
    const authModuleService = container.resolve(utils_1.Modules.AUTH);
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
        }
        else {
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
    }
    catch (error) {
        console.error("❌ Error creating admin user:", error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWFkbWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvY3JlYXRlLWFkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0NBa0VDO0FBcEVELHFEQUFvRDtBQUVyQyxLQUFLLFVBQVUsZUFBZSxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ2pFLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUQsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUxRCxNQUFNLFVBQVUsR0FBRyw0QkFBNEIsQ0FBQztJQUNoRCxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUM7SUFFakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBRXZDLElBQUksQ0FBQztRQUNELCtCQUErQjtRQUMvQixNQUFNLGFBQWEsR0FBRyxNQUFNLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztZQUNwRCxLQUFLLEVBQUUsVUFBVTtTQUNwQixDQUFDLENBQUM7UUFFSCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDM0IsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxVQUFVLFNBQVMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7WUFDbkUsTUFBTSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNsQyxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRUQsMEJBQTBCO1FBQzFCLE1BQU0sSUFBSSxHQUFHLE1BQU0saUJBQWlCLENBQUMsV0FBVyxDQUFDO1lBQzdDLEtBQUssRUFBRSxVQUFVO1lBQ2pCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFNBQVMsRUFBRSxPQUFPO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsVUFBVSxTQUFTLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFFaEUsZ0RBQWdEO1FBQ2hELE1BQU0saUJBQWlCLENBQUMsb0JBQW9CLENBQUM7WUFDekMsbUJBQW1CLEVBQUU7Z0JBQ2pCO29CQUNJLFFBQVEsRUFBRSxXQUFXO29CQUNyQixTQUFTLEVBQUUsU0FBUztvQkFDcEIsaUJBQWlCLEVBQUU7d0JBQ2YsS0FBSyxFQUFFLFVBQVU7d0JBQ2pCLFFBQVEsRUFBRSxhQUFhO3FCQUMxQjtpQkFDSjthQUNKO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFFeEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JELE1BQU0sS0FBSyxDQUFDO0lBQ2hCLENBQUM7QUFDTCxDQUFDIn0=