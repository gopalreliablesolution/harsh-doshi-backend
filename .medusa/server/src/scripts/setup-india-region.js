"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupIndiaRegion;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function setupIndiaRegion({ container }) {
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const regionModuleService = container.resolve(utils_1.Modules.REGION);
    console.log("🇮🇳 Setting up India region with INR currency...");
    try {
        // 1. Check if India region already exists
        const existingRegions = await regionModuleService.listRegions({
            name: "India"
        });
        if (existingRegions && existingRegions.length > 0) {
            console.log("✓ India region already exists:", existingRegions[0].id);
            console.log("\nRegion details:");
            console.log("  Name:", existingRegions[0].name);
            console.log("  Currency:", existingRegions[0].currency_code);
            console.log("  Countries:", existingRegions[0].countries?.map(c => c.iso_2).join(", "));
            return existingRegions[0];
        }
        // 2. Create India region with INR currency
        console.log("Creating India region...");
        const { result: regionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
            input: {
                regions: [
                    {
                        name: "India",
                        currency_code: "inr",
                        countries: ["in"], // ISO code for India
                        automatic_taxes: false,
                        payment_providers: ["pp_system_default"],
                        metadata: {
                            description: "India Region with INR currency"
                        }
                    }
                ]
            }
        });
        const indiaRegion = regionResult[0];
        console.log("✅ Created India region:", indiaRegion.id);
        // 3. Set up tax region for India
        console.log("Setting up tax region...");
        await (0, core_flows_1.createTaxRegionsWorkflow)(container).run({
            input: [{
                    country_code: "in",
                    provider_id: "tp_system",
                }]
        });
        console.log("✅ Tax region configured");
        // 4. Create stock location for India
        console.log("Creating stock location...");
        const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
            input: {
                locations: [
                    {
                        name: "India Warehouse",
                        address: {
                            city: "Mumbai",
                            country_code: "IN",
                            address_1: "",
                        },
                    },
                ],
            },
        });
        const stockLocation = stockLocationResult[0];
        console.log("✅ Created stock location:", stockLocation.id);
        // 5. Get default sales channel
        const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
            name: "Default Sales Channel",
        });
        if (defaultSalesChannel.length > 0) {
            await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
                input: {
                    id: stockLocation.id,
                    add: [defaultSalesChannel[0].id],
                },
            });
            console.log("✅ Linked stock location to sales channel");
        }
        // 6. Create shipping profile if needed
        let shippingProfile;
        const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
            type: "default",
        });
        if (shippingProfiles.length > 0) {
            shippingProfile = shippingProfiles[0];
        }
        else {
            const { result: shippingProfileResult } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
                input: {
                    data: [
                        {
                            name: "Default Shipping Profile",
                            type: "default",
                        },
                    ],
                },
            });
            shippingProfile = shippingProfileResult[0];
        }
        console.log("✅ Shipping profile ready:", shippingProfile.id);
        // 7. Create fulfillment set for India
        console.log("Creating fulfillment set...");
        const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
            name: "India Delivery",
            type: "shipping",
            service_zones: [
                {
                    name: "India",
                    geo_zones: [
                        {
                            country_code: "in",
                            type: "country",
                        },
                    ],
                },
            ],
        });
        console.log("✅ Created fulfillment set:", fulfillmentSet.id);
        // 8. Create shipping options
        console.log("Creating shipping options...");
        await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
            input: [
                {
                    name: "Standard Shipping",
                    price_type: "flat",
                    provider_id: "manual_manual",
                    service_zone_id: fulfillmentSet.service_zones[0].id,
                    shipping_profile_id: shippingProfile.id,
                    type: {
                        label: "Standard",
                        description: "Delivery in 5-7 business days",
                        code: "standard",
                    },
                    prices: [
                        {
                            currency_code: "inr",
                            amount: 10000, // ₹100 (in paisa)
                        },
                        {
                            region_id: indiaRegion.id,
                            amount: 10000,
                        },
                    ],
                    rules: [
                        {
                            attribute: "enabled_in_store",
                            value: "true",
                            operator: "eq",
                        },
                        {
                            attribute: "is_return",
                            value: "false",
                            operator: "eq",
                        },
                    ],
                },
                {
                    name: "Express Shipping",
                    price_type: "flat",
                    provider_id: "manual_manual",
                    service_zone_id: fulfillmentSet.service_zones[0].id,
                    shipping_profile_id: shippingProfile.id,
                    type: {
                        label: "Express",
                        description: "Delivery in 2-3 business days",
                        code: "express",
                    },
                    prices: [
                        {
                            currency_code: "inr",
                            amount: 25000, // ₹250 (in paisa)
                        },
                        {
                            region_id: indiaRegion.id,
                            amount: 25000,
                        },
                    ],
                    rules: [
                        {
                            attribute: "enabled_in_store",
                            value: "true",
                            operator: "eq",
                        },
                        {
                            attribute: "is_return",
                            value: "false",
                            operator: "eq",
                        },
                    ],
                },
            ],
        });
        console.log("✅ Created shipping options");
        console.log("\n🎉 India region setup complete!");
        console.log("\n📋 Summary:");
        console.log("  Region ID:", indiaRegion.id);
        console.log("  Currency: INR (₹)");
        console.log("  Stock Location:", stockLocation.id);
        console.log("  Fulfillment Set:", fulfillmentSet.id);
        console.log("\n✅ Next steps:");
        console.log("  1. Go to Admin Panel > Products");
        console.log("  2. Edit each product and add INR prices to variants");
        console.log("  3. Verify shipping options in Settings > Regions > India");
        return indiaRegion;
    }
    catch (error) {
        console.error("❌ Error setting up India region:", error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtaW5kaWEtcmVnaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvc2V0dXAtaW5kaWEtcmVnaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBV0EsbUNBa09DO0FBNU9ELHFEQUFvRDtBQUNwRCw0REFPcUM7QUFFdEIsS0FBSyxVQUFVLGdCQUFnQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ2xFLE1BQU0sd0JBQXdCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDeEUsTUFBTSx5QkFBeUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzRSxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlELE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQztJQUVqRSxJQUFJLENBQUM7UUFDRCwwQ0FBMEM7UUFDMUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxXQUFXLENBQUM7WUFDMUQsSUFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxlQUFlLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxh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