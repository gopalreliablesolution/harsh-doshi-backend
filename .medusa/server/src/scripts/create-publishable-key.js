"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPublishableKey;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const framework_1 = require("@medusajs/framework");
async function createPublishableKey() {
    await (0, modules_sdk_1.MedusaApp)({});
    try {
        // Get the publishable API key module
        const publishableKeyModule = framework_1.container.resolve("publishableKeyModuleService");
        // Create a new publishable API key
        const publishableKey = await publishableKeyModule.createPublishableKeys({
            title: "Store Frontend Key",
        });
        console.log("✅ Publishable API Key created successfully!");
        console.log("📋 Copy this key to your frontend:");
        console.log(publishableKey.id);
        console.log("\nAdd this to your frontend code:");
        console.log(`const MEDUSA_PUBLISHABLE_KEY = '${publishableKey.id}';`);
        return publishableKey;
    }
    catch (error) {
        console.error("❌ Error creating publishable key:", error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXB1Ymxpc2hhYmxlLWtleS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2NyZWF0ZS1wdWJsaXNoYWJsZS1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSx1Q0F1QkM7QUExQkQsdURBQWlEO0FBQ2pELG1EQUErQztBQUVoQyxLQUFLLFVBQVUsb0JBQW9CO0lBQzlDLE1BQU0sSUFBQSx1QkFBUyxFQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRW5CLElBQUksQ0FBQztRQUNELHFDQUFxQztRQUNyQyxNQUFNLG9CQUFvQixHQUFHLHFCQUFTLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFRLENBQUE7UUFFcEYsbUNBQW1DO1FBQ25DLE1BQU0sY0FBYyxHQUFHLE1BQU0sb0JBQW9CLENBQUMscUJBQXFCLENBQUM7WUFDcEUsS0FBSyxFQUFFLG9CQUFvQjtTQUM5QixDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUE7UUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO1FBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxjQUFjLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUVyRSxPQUFPLGNBQWMsQ0FBQTtJQUN6QixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDekQsTUFBTSxLQUFLLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQyJ9