import { MedusaApp } from "@medusajs/modules-sdk"
import { container } from "@medusajs/framework"

export default async function createPublishableKey() {
    await MedusaApp({})

    try {
        // Get the publishable API key module
        const publishableKeyModule = container.resolve("publishableKeyModuleService") as any

        // Create a new publishable API key
        const publishableKey = await publishableKeyModule.createPublishableKeys({
            title: "Store Frontend Key",
        })

        console.log("✅ Publishable API Key created successfully!")
        console.log("📋 Copy this key to your frontend:")
        console.log(publishableKey.id)
        console.log("\nAdd this to your frontend code:")
        console.log(`const MEDUSA_PUBLISHABLE_KEY = '${publishableKey.id}';`)

        return publishableKey
    } catch (error) {
        console.error("❌ Error creating publishable key:", error)
        throw error
    }
}
