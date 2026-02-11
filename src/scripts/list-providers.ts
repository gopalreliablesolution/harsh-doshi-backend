import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function listProviders({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const paymentModule = container.resolve(Modules.PAYMENT);

    logger.info("Listing registered payment providers...");

    // In Medusa 2.0, we can potentially list providers from the module
    // or check registrations in the container.

    try {
        const providers = await paymentModule.listPaymentProviders({}, { skip: 0, take: 100 });
        logger.info(`Found ${providers.length} payment providers:`);
        providers.forEach(p => {
            logger.info(`  - ID: ${p.id}, Is Enabled: ${p.is_enabled}`);
        });
    } catch (error) {
        logger.error(`Failed to list providers: ${error.message}`);
    }

    logger.info("Finished script.");
}
