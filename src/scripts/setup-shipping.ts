import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function setupShipping({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

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
        const fulfillmentModule = container.resolve(Modules.FULFILLMENT);

        // 4. Create/Get India Service Zone
        let indiaZone = fulfillmentSets.flatMap(fs => fs.service_zones || []).find(sz => sz.name === "India");

        if (!indiaZone) {
            logger.info("Creating India Service Zone...");
            indiaZone = await fulfillmentModule.createServiceZones({
                name: "India",
                fulfillment_set_id: fulfillmentSetId,
                geo_areas: [
                    {
                        country_code: "in",
                        type: "country"
                    }
                ]
            } as any);
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
                price_type: "flat" as any,
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
            } as any);
            logger.info("Shipping option created successfully.");
        } else {
            logger.info("Shipping option for India already exists.");
        }

    } catch (error: any) {
        logger.error(`Error during setup: ${error.message}`);
        console.error(error);
    }

    logger.info("Finished setup script.");
}
