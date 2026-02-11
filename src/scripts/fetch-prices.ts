import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function fetchPrices({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fetching variants with prices...");

    const { data: variants } = await query.graph({
        entity: "variant",
        fields: ["id", "title", "product.id", "prices.id", "prices.amount", "prices.currency_code"],
    });

    logger.info(`Found ${variants.length} variants.`);

    for (const variant of variants) {
        logger.info(`Variant: ${variant.title} (ID: ${variant.id})`);
        const vPrices = (variant as any).prices;
        if (vPrices && vPrices.length > 0) {
            vPrices.forEach((p: any) => {
                logger.info(`        Price: ${p.amount} ${p.currency_code}`);
            });
        }
        else {
            logger.info("  No prices found.");
        }
    }

    logger.info("Finished script.");
}
