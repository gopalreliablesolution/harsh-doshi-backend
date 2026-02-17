"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addInrPrices;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function addInrPrices({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Fetching products and variants...");
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "variants.id", "variants.title"],
    });
    logger.info(`Found ${products.length} products.`);
    const variantPricesInput = [];
    for (const product of products) {
        logger.info(`Processing product: ${product.title}`);
        for (const variant of product.variants) {
            variantPricesInput.push({
                variant_id: variant.id,
                product_id: product.id,
                prices: [
                    {
                        amount: 80000, // 800.00 INR
                        currency_code: "inr",
                    }
                ]
            });
        }
    }
    if (variantPricesInput.length > 0) {
        logger.info(`Upserting prices for ${variantPricesInput.length} variants...`);
        try {
            await (0, core_flows_1.upsertVariantPricesWorkflow)(container).run({
                input: {
                    variantPrices: variantPricesInput,
                    previousVariantIds: []
                },
            });
            logger.info("Successfully added INR prices to all variants.");
        }
        catch (error) {
            logger.error(`Failed to upsert prices: ${error.message}`);
        }
    }
    logger.info("Finished script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLWluci1wcmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9hZGQtaW5yLXByaWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLCtCQStDQztBQWxERCxxREFBc0U7QUFDdEUsNERBQTBFO0FBRTNELEtBQUssVUFBVSxZQUFZLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDOUQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWpFLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUVqRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QyxNQUFNLEVBQUUsU0FBUztRQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQztLQUMzRCxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsUUFBUSxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUM7SUFFbEQsTUFBTSxrQkFBa0IsR0FBVSxFQUFFLENBQUM7SUFFckMsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNwRCxLQUFLLE1BQU0sT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNyQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDdEIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUU7b0JBQ0o7d0JBQ0ksTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhO3dCQUM1QixhQUFhLEVBQUUsS0FBSztxQkFDdkI7aUJBQ0o7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLGtCQUFrQixDQUFDLE1BQU0sY0FBYyxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDO1lBQ0QsTUFBTSxJQUFBLHdDQUEyQixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDN0MsS0FBSyxFQUFFO29CQUNILGFBQWEsRUFBRSxrQkFBa0I7b0JBQ2pDLGtCQUFrQixFQUFFLEVBQUU7aUJBQ3pCO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEMsQ0FBQyJ9