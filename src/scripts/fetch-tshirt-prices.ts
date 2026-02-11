import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function fetchTShirtPrices({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fetching Medusa T-Shirt variants with prices...");

    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "variants.id", "variants.title", "variants.prices.amount", "variants.prices.currency_code"],
        filters: {
            title: "Medusa T-Shirt"
        }
    });

    if (products.length === 0) {
        logger.info("Medusa T-Shirt not found.");
        return;
    }

    const product = products[0];
    logger.info(`Product: ${product.title} (ID: ${product.id})`);
    for (const variant of product.variants) {
        logger.info(`  Variant: ${variant.title} (ID: ${variant.id})`);
        const vPrices = (variant as any).prices;
        if (vPrices && vPrices.length > 0) {
            vPrices.forEach((p: any) => {
                logger.info(`        Price: ${p.amount} ${p.currency_code}`);
            });
        }
        else {
            logger.info("    No prices found.");
        }
    }

    logger.info("Finished script.");
}
