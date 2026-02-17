"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makeIndiaOnly;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function makeIndiaOnly({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
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
    await (0, core_flows_1.updateRegionsWorkflow)(container).run({
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
    const priceUpdates = [];
    for (const variant of variants) {
        const vPrices = variant.prices;
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
            await (0, core_flows_1.upsertVariantPricesWorkflow)(container).run({
                input: {
                    variantPrices: priceUpdates,
                    previousVariantIds: priceUpdates.map(p => p.variant_id)
                }
            });
            logger.info("Product prices successfully updated to INR.");
        }
        catch (error) {
            logger.error(`Failed to upsert prices: ${error.message}`);
            // Fallback: log the first update that fails to see details
            console.error(error);
        }
    }
    logger.info("India-only migration script finished.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZS1pbmRpYS1vbmx5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvbWFrZS1pbmRpYS1vbmx5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0EsZ0NBMEVDO0FBaEZELHFEQUErRTtBQUMvRSw0REFHcUM7QUFFdEIsS0FBSyxVQUFVLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUMvRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBRTdELHdCQUF3QjtJQUN4QixNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN4QyxNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO1FBQ3RCLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7S0FDN0IsQ0FBQyxDQUFDO0lBRUgsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUN4QyxPQUFPO0lBQ1gsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFDL0QsTUFBTSxJQUFBLGtDQUFxQixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN2QyxLQUFLLEVBQUU7WUFDSCxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRTtZQUNoQyxNQUFNLEVBQUU7Z0JBQ0osU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDO2FBQ3BCO1NBQ0o7S0FDSixDQUFDLENBQUM7SUFFSCxrREFBa0Q7SUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQzVELE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFFLGVBQWUsQ0FBQztLQUNoRixDQUFDLENBQUM7SUFFSCxNQUFNLFlBQVksR0FBVSxFQUFFLENBQUM7SUFFL0IsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM3QixNQUFNLE9BQU8sR0FBSSxPQUFlLENBQUMsTUFBZSxDQUFDO1FBQ2pELE1BQU0sUUFBUSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBRS9ELDhEQUE4RDtRQUM5RCxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ2QsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3RCLE1BQU0sRUFBRTtnQkFDSjtvQkFDSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSw2QkFBNkI7b0JBQy9DLE1BQU0sRUFBRSxLQUFLO29CQUNiLGFBQWEsRUFBRSxLQUFLO2lCQUN2QjthQUNKO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixZQUFZLENBQUMsTUFBTSxjQUFjLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUM7WUFDRCxNQUFNLElBQUEsd0NBQTJCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUM3QyxLQUFLLEVBQUU7b0JBQ0gsYUFBYSxFQUFFLFlBQVk7b0JBQzNCLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2lCQUMxRDthQUNKLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLDRCQUE0QixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUMxRCwyREFBMkQ7WUFDM0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUN6RCxDQUFDIn0=