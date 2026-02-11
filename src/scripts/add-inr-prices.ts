import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { upsertVariantPricesWorkflow } from "@medusajs/medusa/core-flows";

export default async function addInrPrices({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fetching products and variants...");

    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "variants.id", "variants.title"],
    });

    logger.info(`Found ${products.length} products.`);

    const variantPricesInput: any[] = [];

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
            await upsertVariantPricesWorkflow(container).run({
                input: {
                    variantPrices: variantPricesInput,
                    previousVariantIds: []
                },
            });
            logger.info("Successfully added INR prices to all variants.");
        } catch (error) {
            logger.error(`Failed to upsert prices: ${error.message}`);
        }
    }

    logger.info("Finished script.");
}
