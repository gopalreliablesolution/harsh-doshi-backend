import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows";

export default async function linkRazorpay({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fetching India region...");

    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name"],
        filters: {
            name: "India"
        }
    });

    if (regions.length === 0) {
        logger.error("India region not found.");
        return;
    }

    const region = regions[0];
    logger.info(`Linking Razorpay to ${region.name} (${region.id})...`);

    try {
        await updateRegionsWorkflow(container).run({
            input: {
                selector: {
                    id: region.id
                },
                update: {
                    payment_providers: ["pp_razorpay_razorpay", "pp_system_default"]
                }
            }
        });
        logger.info("Successfully linked Razorpay to India region.");
    } catch (error) {
        logger.error(`Failed to link Razorpay: ${error.message}`);
    }

    logger.info("Finished script.");
}
