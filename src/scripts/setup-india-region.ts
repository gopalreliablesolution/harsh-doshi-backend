import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import {
    createRegionsWorkflow,
    createShippingOptionsWorkflow,
    createShippingProfilesWorkflow,
    createStockLocationsWorkflow,
    createTaxRegionsWorkflow,
    linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function setupIndiaRegion({ container }: ExecArgs) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const regionModuleService = container.resolve(Modules.REGION);

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
        const { result: regionResult } = await createRegionsWorkflow(container).run({
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
        await createTaxRegionsWorkflow(container).run({
            input: [{
                country_code: "in",
                provider_id: "tp_system",
            }]
        });
        console.log("✅ Tax region configured");

        // 4. Create stock location for India
        console.log("Creating stock location...");
        const { result: stockLocationResult } = await createStockLocationsWorkflow(
            container
        ).run({
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
            await linkSalesChannelsToStockLocationWorkflow(container).run({
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
        } else {
            const { result: shippingProfileResult } =
                await createShippingProfilesWorkflow(container).run({
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
        await createShippingOptionsWorkflow(container).run({
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

    } catch (error) {
        console.error("❌ Error setting up India region:", error);
        throw error;
    }
}
