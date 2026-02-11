import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function checkProviders({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fetching regions and payment providers...");

    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name", "currency_code", "payment_providers.id"],
    });

    for (const region of regions) {
        logger.info(`Region: ${region.name} (Currency: ${region.currency_code})`);
        if (region.payment_providers && region.payment_providers.length > 0) {
            region.payment_providers.forEach(p => {
                p && logger.info(`  Provider: ${p.id}`);
            });
        } else {
            logger.info("  No payment providers found.");
        }
    }

    logger.info("Finished script.");
}
