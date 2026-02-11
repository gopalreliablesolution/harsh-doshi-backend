import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function checkKeyLinks({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fetching publishable keys and their linked regions...");

    const { data: keys } = await query.graph({
        entity: "publishable_api_key",
        fields: ["id", "title", "token", "sales_channels.id", "sales_channels.name"],
    });

    for (const key of keys) {
        logger.info(`Key: ${key.title} (${key.id})`);
        logger.info(`  Token: ${key.token}`);
        if (key.sales_channels && key.sales_channels.length > 0) {
            key.sales_channels.forEach(sc => {
                logger.info(`  Sales Channel: ${sc.name} (${sc.id})`);
            });
        } else {
            logger.info("  No sales channels linked.");
        }
    }

    logger.info("Finished script.");
}
