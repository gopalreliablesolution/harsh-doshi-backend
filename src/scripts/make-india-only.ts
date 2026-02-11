import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
    updateRegionsWorkflow,
    upsertVariantPricesWorkflow
} from "@medusajs/medusa/core-flows";

export default async function makeIndiaOnly({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Starting refined India-only pricing update...");

    // 1. Fetch India region
    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name"],
        filters: { name: "India" }
    });

    const indiaRegion = regions[0];
    if (!indiaRegion) {
        logger.error("India region not found.");
        return;
    }

    // 2. Ensure India region has only India as country
    logger.info("Ensuring India region has only India country...");
    await updateRegionsWorkflow(container).run({
        input: {
            selector: { id: indiaRegion.id },
            update: {
                countries: ["in"]
            }
        }
    });

    // 3. Fetch all product variants with their prices
    logger.info("Fetching all variants and existing prices...");
    const { data: variants } = await query.graph({
        entity: "variant",
        fields: ["id", "title", "prices.id", "prices.currency_code", "prices.amount"],
    });

    const priceUpdates: any[] = [];

    for (const variant of variants) {
        const vPrices = (variant as any).prices as any[];
        const inrPrice = vPrices?.find(p => p.currency_code === "inr");

        // We want each variant to have exactly one INR price of 80000
        priceUpdates.push({
            variant_id: variant.id,
            prices: [
                {
                    id: inrPrice?.id, // If it exists, we update it
                    amount: 80000,
                    currency_code: "inr"
                }
            ]
        });
    }

    if (priceUpdates.length > 0) {
        logger.info(`Upserting INR prices for ${priceUpdates.length} variants...`);
        try {
            await upsertVariantPricesWorkflow(container).run({
                input: {
                    variantPrices: priceUpdates,
                    previousVariantIds: priceUpdates.map(p => p.variant_id)
                }
            });
            logger.info("Product prices successfully updated to INR.");
        } catch (error: any) {
            logger.error(`Failed to upsert prices: ${error.message}`);
            // Fallback: log the first update that fails to see details
            console.error(error);
        }
    }

    logger.info("India-only migration script finished.");
}
