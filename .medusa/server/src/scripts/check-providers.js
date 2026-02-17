"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkProviders;
const utils_1 = require("@medusajs/framework/utils");
async function checkProviders({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
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
        }
        else {
            logger.info("  No payment providers found.");
        }
    }
    logger.info("Finished script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvY2hlY2stcHJvdmlkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsaUNBdUJDO0FBekJELHFEQUFzRTtBQUV2RCxLQUFLLFVBQVUsY0FBYyxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ2hFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFFekQsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDeEMsTUFBTSxFQUFFLFFBQVE7UUFDaEIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsc0JBQXNCLENBQUM7S0FDbEUsQ0FBQyxDQUFDO0lBRUgsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsTUFBTSxDQUFDLElBQUksZUFBZSxNQUFNLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUMxRSxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pDLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO2FBQU0sQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNqRCxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwQyxDQUFDIn0=