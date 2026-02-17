"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listProviders;
const utils_1 = require("@medusajs/framework/utils");
async function listProviders({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const paymentModule = container.resolve(utils_1.Modules.PAYMENT);
    logger.info("Listing registered payment providers...");
    // In Medusa 2.0, we can potentially list providers from the module
    // or check registrations in the container.
    try {
        const providers = await paymentModule.listPaymentProviders({}, { skip: 0, take: 100 });
        logger.info(`Found ${providers.length} payment providers:`);
        providers.forEach(p => {
            logger.info(`  - ID: ${p.id}, Is Enabled: ${p.is_enabled}`);
        });
    }
    catch (error) {
        logger.error(`Failed to list providers: ${error.message}`);
    }
    logger.info("Finished script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9saXN0LXByb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGdDQW9CQztBQXRCRCxxREFBK0U7QUFFaEUsS0FBSyxVQUFVLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUMvRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXpELE1BQU0sQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztJQUV2RCxtRUFBbUU7SUFDbkUsMkNBQTJDO0lBRTNDLElBQUksQ0FBQztRQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sYUFBYSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkYsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLFNBQVMsQ0FBQyxNQUFNLHFCQUFxQixDQUFDLENBQUM7UUFDNUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixNQUFNLENBQUMsS0FBSyxDQUFDLDZCQUE2QixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUMifQ==