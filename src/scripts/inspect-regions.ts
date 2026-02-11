import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createRegionsWorkflow } from "@medusajs/medusa/core-flows";

export default async function inspectRegions({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const regionModuleService = container.resolve(Modules.REGION);
    const storeModuleService = container.resolve(Modules.STORE);

    logger.info("Inspecting regions...");
    const regions = await regionModuleService.listRegions();
    logger.info(`Found ${regions.length} regions:`);
    regions.forEach(r => {
        logger.info(`- ${r.name} (${r.currency_code}) ID: ${r.id}`);
    });

    const indiaRegion = regions.find(r => r.currency_code === "inr" || r.name.toLowerCase() === "india");

    if (!indiaRegion) {
        logger.info("India region not found. Creating it...");

        // Ensure INR is supported by the store
        const [store] = await storeModuleService.listStores();
        logger.info(`Store supported currencies: ${JSON.stringify(store.supported_currencies)}`);

        try {
            const { result } = await createRegionsWorkflow(container).run({
                input: {
                    regions: [
                        {
                            name: "India",
                            currency_code: "inr",
                            countries: ["in"],
                            payment_providers: ["razorpay"],
                        },
                    ],
                },
            });
            logger.info(`India region created: ${result[0].id}`);
        } catch (error) {
            logger.error(`Failed to create India region: ${error.message}`);
        }
    } else {
        logger.info("India region already exists.");
        // Check if razorpay is in payment providers
        // Note: in Medusa 2.0, payment providers are linked differently, but this is a good start.
    }
}
