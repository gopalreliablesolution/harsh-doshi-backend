"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupShipping;
const utils_1 = require("@medusajs/framework/utils");
async function setupShipping({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Checking fulfillment setup...");
    // 1. Fetch fulfillment providers
    const { data: providers } = await query.graph({
        entity: "fulfillment_provider",
        fields: ["id"],
    });
    logger.info(`Fulfillment Providers: ${providers.map(p => p.id).join(", ")}`);
    // 2. Fetch shipping profiles
    const { data: profiles } = await query.graph({
        entity: "shipping_profile",
        fields: ["id", "name", "type"],
    });
    const shippingProfileId = profiles.find(p => p.type === "default")?.id;
    logger.info(`Using Shipping Profile: ${shippingProfileId}`);
    // 3. Fetch Service Zones / Fulfillment Sets
    const { data: fulfillmentSets } = await query.graph({
        entity: "fulfillment_set",
        fields: ["id", "name", "type", "service_zones.id", "service_zones.name"],
    });
    const fulfillmentSetId = fulfillmentSets.find(fs => fs.type === "shipping")?.id;
    logger.info(`Using Fulfillment Set: ${fulfillmentSetId}`);
    if (!fulfillmentSetId || !shippingProfileId) {
        logger.error("Required fulfillment set or shipping profile not found.");
        return;
    }
    try {
        const fulfillmentModule = container.resolve(utils_1.Modules.FULFILLMENT);
        // 4. Create/Get India Service Zone
        let indiaZone = fulfillmentSets.flatMap(fs => fs.service_zones || []).find(sz => sz.name === "India");
        if (!indiaZone) {
            logger.info("Creating India Service Zone...");
            const zones = await fulfillmentModule.createServiceZones({
                name: "India",
                fulfillment_set_id: fulfillmentSetId,
                geo_areas: [
                    {
                        country_code: "in",
                        type: "country"
                    }
                ]
            });
            indiaZone = Array.isArray(zones) ? zones[0] : zones;
        }
        if (!indiaZone?.id) {
            logger.error("Failed to create or find India service zone");
            return;
        }
        logger.info(`Using Service Zone: ${indiaZone.id}`);
        // 5. Create/Get Shipping Option
        const { data: latestOptions } = await query.graph({
            entity: "shipping_option",
            fields: ["id", "service_zone_id"],
            filters: { service_zone_id: indiaZone.id }
        });
        if (latestOptions.length === 0) {
            logger.info("Creating Standard Shipping Option for India...");
            await fulfillmentModule.createShippingOptions({
                name: "Standard Shipping (India)",
                price_type: "flat",
                service_zone_id: indiaZone.id,
                shipping_profile_id: shippingProfileId,
                provider_id: "manual_manual",
                type: {
                    label: "Standard",
                    description: "Standard delivery",
                    code: "standard"
                },
                prices: [
                    {
                        amount: 0,
                        currency_code: "inr"
                    }
                ]
            });
            logger.info("Shipping option created successfully.");
        }
        else {
            logger.info("Shipping option for India already exists.");
        }
    }
    catch (error) {
        logger.error(`Error during setup: ${error.message}`);
        console.error(error);
    }
    logger.info("Finished setup script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtc2hpcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9zZXR1cC1zaGlwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGdDQXVHQztBQXpHRCxxREFBK0U7QUFFaEUsS0FBSyxVQUFVLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUMvRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBRTdDLGlDQUFpQztJQUNqQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLEVBQUUsc0JBQXNCO1FBQzlCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztLQUNqQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFN0UsNkJBQTZCO0lBQzdCLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7S0FDakMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxD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